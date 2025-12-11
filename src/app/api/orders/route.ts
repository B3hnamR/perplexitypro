import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { items, gateway, couponCode } = body;

        // دریافت اطلاعات کاربر
        const user = await prisma.user.findUnique({
            where: { id: session.user?.id }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // ۱. محاسبه دقیق قیمت در سمت سرور
        let calculatedAmount = 0;
        let quantityTotal = 0;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "سبد خرید خالی است" }, { status: 400 });
        }

        for (const item of items) {
            const product = await prisma.product.findUnique({ where: { id: item.id } });
            if (product) {
                calculatedAmount += product.price * item.quantity;
                quantityTotal += item.quantity;
            }
        }

        // ۲. اعمال کد تخفیف (در صورت وجود)
        let discountId = null;
        if (couponCode) {
            const coupon = await prisma.discountCode.findUnique({ where: { code: couponCode } });
            
            // اعتبارسنجی کد تخفیف
            if (coupon && coupon.isActive) {
                const isExpired = coupon.expiresAt && new Date() > coupon.expiresAt;
                const isLimitReached = coupon.maxUses && coupon.usedCount >= coupon.maxUses;
                const isMinPriceMet = !coupon.minOrderPrice || calculatedAmount >= coupon.minOrderPrice;

                // بررسی سقف استفاده برای کاربر خاص
                let userLimitReached = false;
                if (coupon.maxUsesPerUser) {
                    const userUsage = await prisma.order.count({
                        where: {
                            userId: user.id,
                            discountCodeId: coupon.id,
                            status: "PAID"
                        }
                    });
                    if (userUsage >= coupon.maxUsesPerUser) userLimitReached = true;
                }

                if (!isExpired && !isLimitReached && isMinPriceMet && !userLimitReached) {
                    let discountAmount = 0;
                    if (coupon.type === "FIXED") {
                        discountAmount = coupon.value;
                    } else {
                        discountAmount = (calculatedAmount * coupon.value) / 100;
                        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                            discountAmount = coupon.maxDiscount;
                        }
                    }
                    
                    calculatedAmount = Math.max(0, calculatedAmount - discountAmount);
                    discountId = coupon.id;
                }
            }
        }

        // تولید کد پیگیری رندوم
        const trackingCode = "ORD-" + Math.floor(100000 + Math.random() * 900000);

        // ۳. ایجاد سفارش با قیمت محاسبه شده و مطمئن
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                amount: calculatedAmount, // ✅ استفاده از قیمت محاسبه شده
                quantity: quantityTotal,
                status: "PENDING",
                trackingCode: trackingCode,
                customerPhone: user.mobile,
                discountCodeId: discountId,
                customData: JSON.stringify({ gateway }),
            }
        });

        return NextResponse.json({ orderId: order.id });

    } catch (error) {
        console.error("Create Order Error:", error);
        return NextResponse.json({ error: "خطا در ثبت سفارش" }, { status: 500 });
    }
}