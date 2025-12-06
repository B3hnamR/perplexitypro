import { NextResponse } from "next/server";
import { requestPayment, getPaymentUrl } from "@/lib/zarinpal";
import { prisma } from "@/lib/db";
import { paymentSchema } from "@/lib/validations";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const session = await auth();

        const validation = paymentSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: "اطلاعات نامعتبر" }, { status: 400 });
        }

        const { description, email, mobile, quantity, couponCode } = validation.data;
        const qty = quantity || 1;

        // دریافت قیمت اصلی
        const product = await prisma.product.findFirst();
        if (!product) throw new Error("محصول یافت نشد");

        let basePrice = product.price * qty;
        let finalAmount = basePrice;
        let discountCodeId = null;

        // ✅ اعمال تخفیف در سرور (اصلاح شده)
        if (couponCode) {
            const coupon = await prisma.discountCode.findUnique({ where: { code: couponCode } });

            if (coupon && coupon.isActive &&
                (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
                (!coupon.maxUses || coupon.usedCount < coupon.maxUses) &&
                (!coupon.minOrderPrice || basePrice >= coupon.minOrderPrice)) {
                // چک کردن سقف کاربر در لحظه پرداخت
                let allowDiscount = true;
                if (coupon.maxUsesPerUser) {
                    const userId = session?.user?.id;
                    if (userId) {
                        const userUsage = await prisma.order.count({
                            where: { userId, discountCodeId: coupon.id, status: "PAID" }
                        });
                        if (userUsage >= coupon.maxUsesPerUser) allowDiscount = false;
                    } else {
                        // اگر کاربر لاگین نیست و کد محدودیت دارد، تخفیف نده (یا ارور بده)
                        allowDiscount = false;
                    }
                }

                if (allowDiscount) {
                    let discountVal = 0;
                    if (coupon.type === "FIXED") {
                        discountVal = coupon.value;
                    } else {
                        discountVal = (basePrice * coupon.value) / 100;
                        if (coupon.maxDiscount) discountVal = Math.min(discountVal, coupon.maxDiscount);
                    }
                    finalAmount = Math.max(1000, basePrice - discountVal);
                    discountCodeId = coupon.id;
                }
            }
        }

        // پیدا کردن کاربر (برای اتصال سفارش)
        let userId = session?.user?.id;
        if (!userId && mobile) {
            const user = await prisma.user.findUnique({ where: { mobile } });
            if (user) userId = user.id;
        }

        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const callbackUrl = `${baseUrl}/api/payment/verify`;

        // شروع تراکنش
        const result = await prisma.$transaction(async (tx) => {
            const availableLinks = await tx.downloadLink.findMany({
                where: { status: "AVAILABLE" },
                take: qty,
            });

            let linkIds: string[] = [];
            if (availableLinks.length >= qty) {
                linkIds = availableLinks.map(l => l.id);
                await tx.downloadLink.updateMany({
                    where: { id: { in: linkIds } },
                    data: { status: "RESERVED" }
                });
            }

            const payment = await requestPayment(finalAmount, description, callbackUrl, email || undefined, mobile);

            if (!payment.data || payment.data.code !== 100) {
                throw new Error("PAYMENT_FAILED");
            }

            const trackingCode = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

            await tx.order.create({
                data: {
                    amount: finalAmount,
                    originalAmount: basePrice,
                    quantity: qty,
                    customerEmail: email || "",
                    customerPhone: mobile,
                    userId: userId,
                    refId: payment.data.authority,
                    trackingCode,
                    discountCodeId,
                    status: "PENDING",
                    links: linkIds.length > 0 ? {
                        connect: linkIds.map(id => ({ id }))
                    } : undefined
                },
            });

            return { url: getPaymentUrl(payment.data.authority) };
        });

        return NextResponse.json(result);

    } catch (error) {
        console.error("Payment Request Error:", error);
        return NextResponse.json({ error: "خطا در ارتباط با درگاه پرداخت" }, { status: 500 });
    }
}