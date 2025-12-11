import { prisma } from "@/lib/db";
import { sendOTP } from "@/lib/sms";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        const headersList = await headers();
        const ip = headersList.get("x-forwarded-for") || "unknown";
        const isAllowed = rateLimit(ip, 3, 2 * 60 * 1000);

        if (!isAllowed) {
            return NextResponse.json(
                { error: "لطفاً چند دقیقه بعد دوباره تلاش کنید" },
                { status: 429 }
            );
        }

        const { mobile } = await req.json();

        if (!mobile || !/^09\d{9}$/.test(mobile)) {
            return NextResponse.json({ error: "شماره موبایل نامعتبر است" }, { status: 400 });
        }

        const code = Math.floor(10000 + Math.random() * 90000).toString();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

        await prisma.oTP.deleteMany({ where: { mobile } });

        await prisma.oTP.create({
            data: {
                mobile,
                code,
                expiresAt
            }
        });

        const sent = await sendOTP(mobile, code);

        if (sent) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: "ارسال پیامک انجام نشد" }, { status: 500 });
        }

    } catch (error) {
        console.error("OTP API Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}
