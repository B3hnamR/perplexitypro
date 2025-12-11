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
        
        const { trackingCode } = await req.json();
        
        const order = await prisma.order.findUnique({
            where: { trackingCode },
            select: { customerPhone: true }
        });

        if (!order || !order.customerPhone) {
            return NextResponse.json({ error: "سفارش یافت نشد" }, { status: 404 });
        }

        const mobile = order.customerPhone;
        
        const code = Math.floor(10000 + Math.random() * 90000).toString();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

        await prisma.oTP.upsert({
            where: { mobile },
            update: { code, expiresAt },
            create: { mobile, code, expiresAt },
        });

        await sendOTP(mobile, code);

        const maskedMobile = mobile.replace(/(\d{4})\d{3}(\d{4})/, "$1***$2");
        return NextResponse.json({ success: true, mobile: maskedMobile });

    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
