import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const totalSales = await prisma.order.aggregate({
            _sum: { amount: true },
            where: { status: "PAID" },
        });

        const orderCount = await prisma.order.count();
        const pendingOrders = await prisma.order.count({ where: { status: "PENDING" } });
        const availableStock = await prisma.downloadLink.count({ where: { status: "AVAILABLE" } });
        
        // آمار بازدید را فعلا ثابت می‌فرستیم یا از جدول دیگری می‌خوانیم
        const visitorCount = 1200;

        return NextResponse.json({
            totalSales: totalSales._sum.amount || 0,
            orderCount,
            visitorCount,
            pendingOrders,
            availableStock
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}