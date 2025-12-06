import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { startOfMonth, subMonths, startOfDay, subDays, format } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET() {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const now = new Date();
        const firstDayCurrentMonth = startOfMonth(now);
        const firstDayLastMonth = startOfMonth(subMonths(now, 1));
        const sevenDaysAgo = subDays(startOfDay(now), 7);

        // 1. آمار کلی و مقایسه (Financial Analytics)
        const currentMonthSales = await prisma.order.aggregate({
            _sum: { amount: true },
            where: { status: "PAID", createdAt: { gte: firstDayCurrentMonth } }
        });

        const lastMonthSales = await prisma.order.aggregate({
            _sum: { amount: true },
            where: { status: "PAID", createdAt: { gte: firstDayLastMonth, lt: firstDayCurrentMonth } }
        });

        const totalOrders = await prisma.order.count({ where: { status: "PAID" } });
        const totalRevenue = await prisma.order.aggregate({ _sum: { amount: true }, where: { status: "PAID" } });

        // محاسبه درصد رشد
        const currentSales = currentMonthSales._sum.amount || 0;
        const lastSales = lastMonthSales._sum.amount || 0;
        const growthRate = lastSales === 0 ? 100 : ((currentSales - lastSales) / lastSales) * 100;

        // میانگین ارزش سفارش (AOV)
        const aov = totalOrders > 0 ? (totalRevenue._sum.amount || 0) / totalOrders : 0;

        // 2. نمودار فروش (Sales Chart - Last 30 Days)
        // نکته: برای محیط پروداکشن واقعی بهتر است از raw query استفاده شود، اما اینجا با JS تجمیع می‌کنیم
        const last30DaysOrders = await prisma.order.findMany({
            where: { status: "PAID", createdAt: { gte: subDays(now, 30) } },
            select: { createdAt: true, amount: true }
        });

        const salesChartData = last30DaysOrders.reduce((acc: any[], order) => {
            const date = format(order.createdAt, "yyyy-MM-dd");
            const existing = acc.find(x => x.date === date);
            if (existing) {
                existing.sales += order.amount;
                existing.count += 1;
            } else {
                acc.push({ date, sales: order.amount, count: 1 });
            }
            return acc;
        }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // 3. هوش انبار (Inventory)
        const availableStock = await prisma.downloadLink.count({ where: { status: "AVAILABLE" } });
        const usedLast7Days = await prisma.downloadLink.count({
            where: { status: "USED", consumedAt: { gte: sevenDaysAgo } }
        });

        // پیش‌بینی اتمام موجودی
        const dailyBurnRate = usedLast7Days / 7;
        const daysUntilStockout = dailyBurnRate > 0 ? Math.floor(availableStock / dailyBurnRate) : 999;

        // 4. مشتریان (Customer Insights)
        const topSpenders = await prisma.order.groupBy({
            by: ['customerEmail'],
            _sum: { amount: true },
            _count: { id: true },
            where: { status: "PAID", customerEmail: { not: null } },
            orderBy: { _sum: { amount: 'desc' } },
            take: 5
        });

        // 5. قیف فروش (Simple Funnel)
        const allOrdersCount = await prisma.order.count(); // همه تلاش‌ها
        const paidOrdersCount = await prisma.order.count({ where: { status: "PAID" } });
        const conversionRate = allOrdersCount > 0 ? (paidOrdersCount / allOrdersCount) * 100 : 0;

        // 6. کدهای تخفیف (Marketing)
        const topCoupons = await prisma.discountCode.findMany({
            orderBy: { usedCount: 'desc' },
            take: 5,
            select: { code: true, usedCount: true, type: true, value: true }
        });

        // 7. لاگ فعالیت‌ها (Activity Logs)
        const logs = await prisma.activityLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        return NextResponse.json({
            financials: {
                totalRevenue: totalRevenue._sum.amount || 0,
                monthlyRevenue: currentSales,
                growthRate,
                aov
            },
            charts: {
                sales: salesChartData
            },
            inventory: {
                available: availableStock,
                burnRate: dailyBurnRate,
                daysRemaining: daysUntilStockout
            },
            customers: {
                topSpenders
            },
            funnel: {
                total: allOrdersCount,
                paid: paidOrdersCount,
                rate: conversionRate
            },
            marketing: {
                topCoupons
            },
            logs
        });

    } catch (error) {
        console.error("Analytics Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}