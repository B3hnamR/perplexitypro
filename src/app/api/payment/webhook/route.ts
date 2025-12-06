import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPayment } from "@/lib/zarinpal";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        // زرین‌پال معمولا اطلاعات را در Body یا Query می‌فرستد. 
        // در V4 معمولا باید Authority را داشته باشیم.
        const body = await req.json();
        const { Authority, Status } = body;

        if (!Authority) {
            return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
        }

        const order = await prisma.order.findFirst({
            where: { refId: Authority },
            include: { links: true }
        });

        if (!order) {
            return NextResponse.json({ error: "Order Not Found" }, { status: 404 });
        }

        // اگر سفارش قبلاً پرداخت شده، کاری نکنیم
        if (order.status === "PAID") {
            return NextResponse.json({ message: "Already Paid" });
        }

        if (Status === "OK") {
            // تایید تراکنش
            const verification = await verifyPayment(Authority, order.amount);

            if (verification.data && (verification.data.code === 100 || verification.data.code === 101)) {
                const downloadToken = crypto.randomBytes(32).toString("hex");

                // 1. تغییر وضعیت لینک‌ها
                if (order.links.length > 0) {
                    await prisma.downloadLink.updateMany({
                        where: { orderId: order.id },
                        data: { status: "USED", consumedAt: new Date() }
                    });
                }

                // 2. تایید سفارش
                await prisma.order.update({
                    where: { id: order.id },
                    data: {
                        status: "PAID",
                        refId: String(verification.data.ref_id),
                        downloadToken
                    }
                });

                // 3. افزایش استفاده کد تخفیف
                if (order.discountCodeId) {
                    await prisma.discountCode.update({
                        where: { id: order.discountCodeId },
                        data: { usedCount: { increment: 1 } }
                    });
                }

                return NextResponse.json({ status: "Success", refId: verification.data.ref_id });
            }
        }

        // اگر پرداخت ناموفق بود
        // لینک‌ها را آزاد می‌کنیم
        if (order.links.length > 0) {
            await prisma.downloadLink.updateMany({
                where: { orderId: order.id },
                data: { status: "AVAILABLE", orderId: null }
            });
        }
        await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });

        return NextResponse.json({ status: "Failed" });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}