import { NextResponse } from "next/server";
import { verifyPayment } from "@/lib/zarinpal";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");

    // ✅ اصلاح حیاتی: استفاده از آدرس دامنه اصلی برای ریدایرکت
    // اگر متغیر محیطی ست نشده باشد، به عنوان فال‌بک از دامین شما استفاده می‌شود
    const baseUrl = process.env.NEXTAUTH_URL || "https://perplexitypro.ir";

    // پیدا کردن سفارش
    const order = authority ? await prisma.order.findFirst({ 
        where: { refId: authority },
        include: { links: true }
    }) : null;

    if (!order) {
        // ریدایرکت با استفاده از آدرس اصلی سایت
        return NextResponse.redirect(new URL("/payment/failed?error=OrderNotFound", baseUrl));
    }

    // اگر قبلا پرداخت شده، ریدایرکت کن
    if (order.status === "PAID" && order.downloadToken) {
         return NextResponse.redirect(new URL(`/delivery/${order.downloadToken}`, baseUrl));
    }

    // تابع آزادسازی لینک‌ها در صورت خطا
    const releaseLinks = async () => {
        if (order.links.length > 0) {
            await prisma.downloadLink.updateMany({
                where: { orderId: order.id },
                data: { status: "AVAILABLE", orderId: null }
            });
        }
        await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    };

    // اگر کاربر انصراف داده یا پرداخت ناموفق بوده
    if (status !== "OK") {
        await releaseLinks();
        return NextResponse.redirect(new URL("/payment/failed", baseUrl));
    }

    try {
        const response = await verifyPayment(authority!, order.amount);

        if (response.data && (response.data.code === 100 || response.data.code === 101)) {
            const downloadToken = crypto.randomBytes(32).toString("hex");

            // 1. نهایی کردن خرید
            if (order.links.length > 0) {
                const linkIds = order.links.map(l => l.id);
                await prisma.downloadLink.updateMany({
                    where: { id: { in: linkIds } },
                    data: { 
                        status: "USED", 
                        consumedAt: new Date() 
                    },
                });
            }

            // 2. آپدیت سفارش
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    status: "PAID",
                    refId: String(response.data.ref_id),
                    downloadToken,
                },
            });

            // 3. کد تخفیف
            if (order.discountCodeId) {
                await prisma.discountCode.update({
                    where: { id: order.discountCodeId },
                    data: { usedCount: { increment: 1 } }
                });
            }

            return NextResponse.redirect(new URL(`/delivery/${downloadToken}`, baseUrl));
        } else {
            // پرداخت توسط بانک تایید نشد
            await releaseLinks();
            return NextResponse.redirect(new URL("/payment/failed", baseUrl));
        }
    } catch (error) {
        console.error("Verify Error:", error);
        await releaseLinks();
        return NextResponse.redirect(new URL("/payment/failed?error=InternalError", baseUrl));
    }
}