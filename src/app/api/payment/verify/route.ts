import { prisma } from "@/lib/db";
import { paymentProvider } from "@/lib/payment";
import { sendAdminAlert, sendOrderNotification } from "@/lib/sms";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const gateway = searchParams.get("gateway") as "ZARINPAL" | "ZIBAL";
    const orderId = searchParams.get("orderId");
    
    const authority = searchParams.get("Authority") || searchParams.get("trackId");
    const status = searchParams.get("Status");
    const success = searchParams.get("success");

    // متغیر برای ذخیره آدرس نهایی ریدایرکت
    let destinationUrl = "";

    try {
        // 1. بررسی انصراف کاربر
        const isCanceled = (gateway === "ZARINPAL" && status !== "OK") || (gateway === "ZIBAL" && success !== "1");

        if (!orderId || !authority || isCanceled) {
            const msg = encodeURIComponent("پرداخت توسط کاربر لغو شد");
            destinationUrl = `/payment/result?status=failed&message=${msg}`;
            throw new Error("Canceled"); // پرش به مرحله نهایی
        }

        // 2. یافتن سفارش
        const order = await prisma.order.findUnique({ 
            where: { id: orderId } 
        });

        if (!order) {
            const msg = encodeURIComponent("سفارش یافت نشد");
            destinationUrl = `/?error=${msg}`;
            throw new Error("Order Not Found");
        }
        
        if (order.status === "PAID") {
            destinationUrl = `/payment/result?status=success&orderId=${orderId}`;
            throw new Error("Already Paid"); // پرش به مرحله نهایی (با موفقیت)
        }

        // 3. تایید نهایی (Verify)
        const verifyRes = await paymentProvider.verify({
            gateway,
            amount: order.amount,
            authority: authority
        });

        if (verifyRes.success) {
            // ✅ موفقیت
            const downloadToken = order.downloadToken || Math.random().toString(36).substring(7);

            await prisma.order.update({
                where: { id: orderId },
                data: {
                    status: "PAID",
                    refId: verifyRes.refId ? String(verifyRes.refId) : null,
                    downloadToken: downloadToken,
                }
            });
            
            if (order.discountCodeId) {
                await prisma.discountCode.update({
                    where: { id: order.discountCodeId },
                    data: { usedCount: { increment: 1 } }
                });
            }

            // ارسال پیامک (بدون منتظر ماندن برای افزایش سرعت)
            if (order.customerPhone) sendOrderNotification(order.customerPhone, order.trackingCode || "N/A");
            sendAdminAlert(order.amount);

            destinationUrl = `/payment/result?status=success&orderId=${orderId}`;
        } else {
            // ❌ شکست در وریفای
            const msg = encodeURIComponent("تراکنش توسط بانک تایید نشد");
            destinationUrl = `/payment/result?status=failed&message=${msg}`;
        }

    } catch (error: any) {
        // اگر ارور ما "Canceled" یا "Already Paid" نبود، یعنی خطای واقعی رخ داده
        if (error.message !== "Canceled" && error.message !== "Already Paid" && error.message !== "Order Not Found") {
            console.error("Payment Verify Error:", error);
            const msg = encodeURIComponent("خطای فنی در پردازش پرداخت");
            destinationUrl = `/payment/result?status=failed&message=${msg}`;
        }
    }

    // 🚀 ریدایرکت نهایی (بیرون از Try/Catch تا ارور NEXT_REDIRECT ندهد)
    if (destinationUrl) {
        return redirect(destinationUrl);
    }
}