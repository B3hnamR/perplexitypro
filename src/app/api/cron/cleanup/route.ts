import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// این توکن را در .env ست کنید تا هر کسی نتواند کران را اجرا کند
const CRON_SECRET = process.env.CRON_SECRET || "my-secret-key";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    // بررسی امنیت
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    const authHeader = req.headers.get("authorization");

    if (key !== CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const now = new Date();
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000); // 30 دقیقه قبل

        // 1. پیدا کردن سفارشات PENDING که قدیمی شده‌اند
        const expiredOrders = await prisma.order.findMany({
            where: {
                status: "PENDING",
                createdAt: { lt: thirtyMinutesAgo }
            },
            include: { links: true }
        });

        let releasedLinksCount = 0;
        let expiredOrdersCount = 0;

        for (const order of expiredOrders) {
            // آزادسازی لینک‌ها
            if (order.links.length > 0) {
                const updatedLinks = await prisma.downloadLink.updateMany({
                    where: { orderId: order.id },
                    data: { status: "AVAILABLE", orderId: null }
                });
                releasedLinksCount += updatedLinks.count;
            }

            // تغییر وضعیت سفارش به FAILED یا EXPIRED
            await prisma.order.update({
                where: { id: order.id },
                data: { status: "FAILED" } // یا یک وضعیت جدید مثل EXPIRED
            });

            expiredOrdersCount++;
        }

        return NextResponse.json({
            success: true,
            message: `Cleaned up ${expiredOrdersCount} orders and released ${releasedLinksCount} links.`,
            timestamp: now.toISOString()
        });

    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ error: "Cron Failed" }, { status: 500 });
    }
}