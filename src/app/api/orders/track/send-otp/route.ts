import { prisma } from "@/lib/db";
import { sendOTP } from "@/lib/sms";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { trackingCode } = await req.json();
        
        const order = await prisma.order.findUnique({
            where: { trackingCode },
            select: { customerPhone: true }
        });

        if (!order || !order.customerPhone) {
            return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
        }

        const mobile = order.customerPhone;
        
        // تولید و ارسال کد (مشابه سیستم لاگین)
        const code = Math.floor(10000 + Math.random() * 90000).toString();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

        await prisma.oTP.upsert({
            where: { mobile },
            update: { code, expiresAt },
            create: { mobile, code, expiresAt },
        });

        await sendOTP(mobile, code);

        // بازگرداندن شماره ماسک شده (مثلاً 0912***1234)
        const maskedMobile = mobile.replace(/(\d{4})\d{3}(\d{4})/, "$1***$2");
        return NextResponse.json({ success: true, mobile: maskedMobile });

    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}