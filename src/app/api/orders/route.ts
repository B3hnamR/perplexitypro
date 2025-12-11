import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

type CartItem = { id: string; quantity: number };

export async function POST(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { items, gateway, couponCode } = body;

        const user = await prisma.user.findUnique({
            where: { id: session.user?.id }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "سبد خرید خالی است" }, { status: 400 });
        }

        const sanitizedItems: CartItem[] = items.map((item: any) => ({
            id: String(item.id || "").trim(),
            quantity: Number(item.quantity || 0)
        })).filter((item: CartItem) => item.id && Number.isInteger(item.quantity) && item.quantity > 0);

        if (sanitizedItems.length !== items.length) {
            return NextResponse.json({ error: "آیتم‌های سبد خرید نامعتبر است" }, { status: 400 });
        }

        const productIds = sanitizedItems.map((i) => i.id);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });

        if (products.length !== productIds.length) {
            return NextResponse.json({ error: "بخشی از محصولات یافت نشد" }, { status: 400 });
        }

        let calculatedAmount = 0;
        let quantityTotal = 0;

        for (const item of sanitizedItems) {
            const product = products.find((p) => p.id === item.id);
            calculatedAmount += (product?.price || 0) * item.quantity;
            quantityTotal += item.quantity;
        }

        if (calculatedAmount <= 0 || quantityTotal <= 0) {
            return NextResponse.json({ error: "مبلغ سفارش نامعتبر است" }, { status: 400 });
        }

        const originalAmount = calculatedAmount;

        let discountId: string | null = null;
        if (couponCode) {
            const coupon = await prisma.discountCode.findUnique({ where: { code: couponCode } });
            
            if (coupon && coupon.isActive) {
                const isExpired = coupon.expiresAt && new Date() > coupon.expiresAt;
                const isLimitReached = coupon.maxUses && coupon.usedCount >= coupon.maxUses;
                const isMinPriceMet = !coupon.minOrderPrice || calculatedAmount >= coupon.minOrderPrice;

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

        if (calculatedAmount <= 0) {
            return NextResponse.json({ error: "مبلغ نهایی سفارش نامعتبر است" }, { status: 400 });
        }

        const trackingCode = "ORD-" + Math.floor(100000 + Math.random() * 900000);

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                amount: calculatedAmount,
                originalAmount,
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
        return NextResponse.json({ error: "خطای داخلی در ایجاد سفارش" }, { status: 500 });
    }
}
