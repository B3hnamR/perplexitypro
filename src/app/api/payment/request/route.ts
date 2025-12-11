import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { paymentProvider } from "@/lib/payment";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { gateway, orderId } = body;

        // 1. دریافت سفارش
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true }
        });

        if (!order) return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
        
        // 2. ساخت لینک بازگشت
        // ⚠️ نکته مهم: درگاه‌های بانکی معمولاً به localhost وریفای نمی‌دهند
        const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify?gateway=${gateway}&orderId=${order.id}`;

        // 3. درخواست به درگاه
        const paymentRes = await paymentProvider.request({
            gateway: gateway as "ZARINPAL" | "ZIBAL",
            amount: order.amount,
            description: `Order ${order.trackingCode}`,
            mobile: order.customerPhone || session.user?.mobile || "",
            callbackUrl: callbackUrl
        });

        if (paymentRes?.url) {
            return NextResponse.json({ url: paymentRes.url });
        } else {
            return NextResponse.json({ error: "دریافت لینک پرداخت ناموفق بود" }, { status: 500 });
        }

    } catch (error: any) {
        console.error("❌ Payment Request API Error:", error.message);
        // اینجا متن دقیق ارور را برمی‌گردانیم تا در مودال نمایش داده شود
        return NextResponse.json({ error: error.message || "خطا در اتصال به درگاه" }, { status: 500 });
    }
}