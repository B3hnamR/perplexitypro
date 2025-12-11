import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { paymentProvider } from "@/lib/payment";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { gateway, orderId } = body; // gateway: "ZARINPAL" | "ZIBAL"

        // 1. پیدا کردن سفارش
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true }
        });

        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
        if (order.status === "PAID") return NextResponse.json({ error: "Already paid" }, { status: 400 });

        // 2. ساخت لینک بازگشت (Callback)
        // ما gateway و orderId را در URL میگذاریم تا موقع برگشت بدانیم چه خبر است
        const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify?gateway=${gateway}&orderId=${order.id}`;

        // 3. درخواست به درگاه
        const paymentRes = await paymentProvider.request({
            gateway: gateway,
            amount: order.amount,
            description: `سفارش ${order.trackingCode} - Perplexity Pro`,
            mobile: order.customerPhone || session.user?.mobile || "",
            callbackUrl: callbackUrl
        });

        // 4. (اختیاری) ذخیره Authority در سفارش برای پیگیری‌های بعدی
        // فعلاً نیازی نیست چون در Callback داریمش

        return NextResponse.json({ url: paymentRes.url });

    } catch (error: any) {
        console.error("Payment Request Error:", error.message);
        return NextResponse.json({ error: "خطا در اتصال به درگاه پرداخت" }, { status: 500 });
    }
}