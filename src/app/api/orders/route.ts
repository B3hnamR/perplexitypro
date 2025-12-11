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
        const { totalAmount, gateway } = body;

        // تولید کد پیگیری رندوم
        const trackingCode = "ORD-" + Math.floor(100000 + Math.random() * 900000);

        // دریافت اطلاعات کاربر از دیتابیس (برای اطمینان از شماره موبایل)
        const user = await prisma.user.findUnique({
            where: { id: session.user?.id }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // ایجاد سفارش در دیتابیس
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                amount: totalAmount,
                status: "PENDING", // وضعیت اولیه
                trackingCode: trackingCode,
                customerPhone: user.mobile,
                // اگر می‌خواهید درگاه انتخابی را هم ذخیره کنید، می‌توانید در customData بگذارید
                customData: JSON.stringify({ gateway }),
            }
        });

        return NextResponse.json({ orderId: order.id });

    } catch (error) {
        console.error("Create Order Error:", error);
        return NextResponse.json({ error: "خطا در ثبت سفارش" }, { status: 500 });
    }
}