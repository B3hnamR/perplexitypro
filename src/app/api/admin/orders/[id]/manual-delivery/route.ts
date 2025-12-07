import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { sendOrderNotification } from "@/lib/sms";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id } = await params;
        const { link } = await req.json();

        // 1. ثبت لینک در دیتابیس
        await prisma.downloadLink.create({
            data: {
                url: link,
                status: "USED",
                orderId: id,
                consumedAt: new Date()
            }
        });

        // 2. تغییر وضعیت سفارش به تکمیل شده
        const order = await prisma.order.update({
            where: { id },
            data: { status: "COMPLETED" } // وضعیت را به تکمیل تغییر می‌دهیم
        });
        
        if (order && order.customerPhone) {
            // 3. ✅ ارسال پیامک اطلاع‌رسانی با قالب "ثبت سفارش"
            // چون قالب جداگانه نساختیم، از همان قالب ثبت سفارش استفاده می‌کنیم تا کد پیگیری را ببیند
            await sendOrderNotification(order.customerPhone, order.trackingCode || "");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}