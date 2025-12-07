import { NextResponse } from "next/server";
import { verifyPayment } from "@/lib/zarinpal";
import { prisma } from "@/lib/db";
import crypto from "crypto";
import { sendOrderNotification, sendAdminAlert } from "@/lib/sms"; // ✅ ایمپورت توابع پیامک

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");
    const baseUrl = process.env.NEXTAUTH_URL || "https://perplexitypro.ir";

    const order = authority ? await prisma.order.findFirst({ 
        where: { refId: authority },
        include: { links: true }
    }) : null;

    if (!order) return NextResponse.redirect(new URL("/payment/failed?error=OrderNotFound", baseUrl));

    if (order.status === "PAID" && order.downloadToken) {
         return NextResponse.redirect(new URL(`/delivery/${order.downloadToken}`, baseUrl));
    }

    const releaseLinks = async () => {
        if (order.links.length > 0) {
            await prisma.downloadLink.updateMany({
                where: { orderId: order.id },
                data: { status: "AVAILABLE", orderId: null }
            });
        }
        await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    };

    if (status !== "OK") {
        await releaseLinks();
        return NextResponse.redirect(new URL("/payment/failed", baseUrl));
    }

    try {
        const response = await verifyPayment(authority!, order.amount);

        if (response.data && (response.data.code === 100 || response.data.code === 101)) {
            const downloadToken = crypto.randomBytes(32).toString("hex");

            if (order.links.length > 0) {
                const linkIds = order.links.map(l => l.id);
                await prisma.downloadLink.updateMany({
                    where: { id: { in: linkIds } },
                    data: { status: "USED", consumedAt: new Date() },
                });
            }

            await prisma.order.update({
                where: { id: order.id },
                data: {
                    status: "PAID",
                    refId: String(response.data.ref_id),
                    downloadToken,
                },
            });

            if (order.discountCodeId) {
                await prisma.discountCode.update({
                    where: { id: order.discountCodeId },
                    data: { usedCount: { increment: 1 } }
                });
            }

            // ✅ ارسال پیامک‌ها
            if (order.customerPhone) {
                // ارسال به مشتری
                await sendOrderNotification(order.customerPhone, order.trackingCode || "---");
            }
            // ارسال به مدیر
            await sendAdminAlert(order.amount);

            return NextResponse.redirect(new URL(`/delivery/${downloadToken}`, baseUrl));
        } else {
            await releaseLinks();
            return NextResponse.redirect(new URL("/payment/failed", baseUrl));
        }
    } catch (error) {
        console.error("Verify Error:", error);
        await releaseLinks();
        return NextResponse.redirect(new URL("/payment/failed?error=InternalError", baseUrl));
    }
}