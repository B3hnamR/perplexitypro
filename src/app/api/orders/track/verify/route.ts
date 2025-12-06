import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { trackingCode, otp } = await req.json();

        const order = await prisma.order.findUnique({
            where: { trackingCode },
            include: { links: true }
        });

        if (!order || !order.customerPhone) {
            return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
        }

        const mobile = order.customerPhone;
        const otpRecord = await prisma.oTP.findUnique({ where: { mobile } });

        if (!otpRecord || otpRecord.code !== otp || otpRecord.expiresAt < new Date()) {
            return NextResponse.json({ error: "کد تایید نامعتبر است" }, { status: 400 });
        }

        // حذف کد و بازگشت اطلاعات
        await prisma.oTP.delete({ where: { mobile } });

        return NextResponse.json(order);
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}