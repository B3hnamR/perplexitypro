import { prisma } from "@/lib/db";
import { sendOTP } from "@/lib/sms";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit"; // ایمپورت ریت لیمیت
import { headers } from "next/headers"; // برای گرفتن IP

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        // 1. بررسی Rate Limit (جلوگیری از SMS Bombing)
        const headersList = await headers();
        const ip = headersList.get("x-forwarded-for") || "unknown";
        
        // مثلا: ۳ درخواست در هر ۲ دقیقه مجاز است
        const isAllowed = rateLimit(ip, 3, 2 * 60 * 1000); 

        if (!isAllowed) {
            return NextResponse.json(
                { error: "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً چند دقیقه صبر کنید." },
                { status: 429 }
            );
        }

        const { mobile } = await req.json();
        
        if (!mobile || !/^09\d{9}$/.test(mobile)) {
            return NextResponse.json({ error: "شماره موبایل نامعتبر است" }, { status: 400 });
        }

        // بررسی اینکه آیا کاربر قبلاً ثبت‌نام کرده است؟
        const existingUser = await prisma.user.findUnique({
            where: { mobile }
        });

        const code = Math.floor(10000 + Math.random() * 90000).toString();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000); 

        // ذخیره کد در دیتابیس
        await prisma.oTP.upsert({
            where: { mobile },
            update: { code, expiresAt },
            create: { mobile, code, expiresAt },
        });

        const sent = await sendOTP(mobile, code);

        if (sent) {
            return NextResponse.json({ 
                success: true, 
                isNewUser: !existingUser
            });
        } else {
            if (process.env.NODE_ENV !== "production") {
                console.warn("⚠️ SMS Failed (Template Error?) but bypassed in DEV mode.");
                return NextResponse.json({ 
                    success: true,
                    isNewUser: !existingUser
                });
            }
            return NextResponse.json({ error: "خطا در ارسال پیامک" }, { status: 500 });
        }

    } catch (error) {
        console.error("OTP Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}