import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

const CRON_SECRET = process.env.CRON_SECRET;

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    const authHeader = req.headers.get("authorization");

    if (!CRON_SECRET) {
        return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
    }

    if (key !== CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const now = new Date();
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

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
            if (order.links.length > 0) {
                const updatedLinks = await prisma.downloadLink.updateMany({
                    where: { orderId: order.id },
                    data: { status: "AVAILABLE", orderId: null }
                });
                releasedLinksCount += updatedLinks.count;
            }

            await prisma.order.update({
                where: { id: order.id },
                data: { status: "FAILED" }
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
