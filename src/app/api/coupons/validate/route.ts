import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const { code, cartTotal } = await req.json();
        const session = await auth();

        const coupon = await prisma.discountCode.findUnique({
            where: { code },
        });

        if (!coupon) return NextResponse.json({ error: "کد تخفیف نامعتبر است." }, { status: 404 });
        if (!coupon.isActive) return NextResponse.json({ error: "این کد تخفیف غیرفعال شده است." }, { status: 400 });
        if (coupon.expiresAt && new Date() > coupon.expiresAt) return NextResponse.json({ error: "مهلت استفاده از این کد تمام شده است." }, { status: 400 });
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return NextResponse.json({ error: "ظرفیت استفاده از این کد تکمیل شده است." }, { status: 400 });
        if (coupon.minOrderPrice && cartTotal < coupon.minOrderPrice) return NextResponse.json({ error: `این کد برای خریدهای بالای ${coupon.minOrderPrice.toLocaleString()} تومان معتبر است.` }, { status: 400 });

        // ✅ بررسی سقف استفاده کاربر
        if (coupon.maxUsesPerUser) {
            if (!session || !session.user?.id) {
                return NextResponse.json({ error: "برای استفاده از این کد باید وارد حساب کاربری شوید." }, { status: 401 });
            }

            const userUsage = await prisma.order.count({
                where: {
                    userId: session.user.id,
                    discountCodeId: coupon.id,
                    status: "PAID"
                }
            });

            if (userUsage >= coupon.maxUsesPerUser) {
                return NextResponse.json({ error: "شما به سقف مجاز استفاده از این کد رسیده‌اید." }, { status: 400 });
            }
        }

        return NextResponse.json({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            maxDiscount: coupon.maxDiscount
        });

    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}