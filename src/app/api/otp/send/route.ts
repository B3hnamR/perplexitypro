import { prisma } from "@/lib/db";
import { sendOTP } from "@/lib/sms";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { mobile } = await req.json();

        // تولید کد ۵ رقمی
        const code = Math.floor(10000 + Math.random() * 90000).toString();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // اعتبار ۲ دقیقه

        // حذف کدهای قبلی این شماره
        await prisma.oTP.deleteMany({ where: { mobile } });
        
        // ذخیره در دیتابیس
        await prisma.oTP.create({
            data: {
                mobile,
                code,
                expiresAt
            }
        });

        // ارسال با SMS.ir
        const sent = await sendOTP(mobile, code);

        if (sent) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: "خطا در ارسال پیامک" }, { status: 500 });
        }

    } catch (error) {
        console.error("OTP API Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}