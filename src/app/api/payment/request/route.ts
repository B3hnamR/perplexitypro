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

        if (!["ZARINPAL", "ZIBAL"].includes(gateway)) {
            return NextResponse.json({ error: "درگاه نامعتبر است" }, { status: 400 });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true }
        });

        if (!order) return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
        if (order.status === "PAID") {
            return NextResponse.json({ error: "سفارش قبلا پرداخت شده است" }, { status: 400 });
        }
        
        const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify?gateway=${gateway}&orderId=${order.id}`;

        const paymentRes = await paymentProvider.request({
            gateway: gateway as "ZARINPAL" | "ZIBAL",
            amount: order.amount,
            description: `Order ${order.trackingCode}`,
            mobile: order.customerPhone || (session as any).user?.mobile || "",
            callbackUrl: callbackUrl
        });

        if (paymentRes?.authority) {
            let customData: Record<string, any> = {};
            if (order.customData) {
                try { customData = JSON.parse(order.customData); } catch { customData = {}; }
            }
            customData.gateway = gateway;
            customData.authority = paymentRes.authority;

            await prisma.order.update({
                where: { id: order.id },
                data: {
                    refId: paymentRes.authority,
                    customData: JSON.stringify(customData)
                }
            });
        }

        if (paymentRes?.url) {
            return NextResponse.json({ url: paymentRes.url });
        } else {
            return NextResponse.json({ error: "خطا در ایجاد درخواست پرداخت" }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Payment Request API Error:", error.message);
        return NextResponse.json({ error: error.message || "خطای داخلی در ایجاد پرداخت" }, { status: 500 });
    }
}
