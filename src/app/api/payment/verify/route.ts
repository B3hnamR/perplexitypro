import { prisma } from "@/lib/db";
import { paymentProvider } from "@/lib/payment";
import { sendAdminAlert, sendOrderNotification } from "@/lib/sms";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

// چون این روت داینامیک است و کوئری پارامتر دارد، باید Force Dynamic باشد
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const gateway = searchParams.get("gateway") as "ZARINPAL" | "ZIBAL";
    const orderId = searchParams.get("orderId");
    
    // پارامترهای بازگشتی از درگاه‌ها
    const authority = searchParams.get("Authority") || searchParams.get("trackId"); // زرین‌پال Authority میدهد، زیبال trackId
    const status = searchParams.get("Status"); // وضعیت زرین‌پال (OK/NOK)
    const success = searchParams.get("success"); // وضعیت زیبال (1/0)

    // بررسی اولیه: آیا کاربر انصراف داده؟
    const isCanceled = (gateway === "ZARINPAL" && status !== "OK") || (gateway === "ZIBAL" && success !== "1");

    if (!orderId || !authority || isCanceled) {
        return redirect(`/payment/result?status=failed&message=پرداخت توسط کاربر لغو شد`);
    }

    try {
        // 1. یافتن سفارش در دیتابیس
        const order = await prisma.order.findUnique({ 
            where: { id: orderId } 
        });

        if (!order) {
            return redirect("/?error=order_not_found");
        }
        
        // اگر سفارش قبلاً پرداخت شده، نیازی به تایید مجدد نیست
        if (order.status === "PAID") {
            return redirect(`/payment/result?status=success&orderId=${orderId}`);
        }

        // 2. تایید نهایی تراکنش با درگاه (Verify)
        const verifyRes = await paymentProvider.verify({
            gateway,
            amount: order.amount,
            authority: authority
        });

        if (verifyRes.success) {
            // ✅ پرداخت موفق بود

            // تولید توکن دانلود یکتا (اگر قبلاً نداشته باشد)
            const downloadToken = order.downloadToken || Math.random().toString(36).substring(7);

            // 3. آپدیت وضعیت سفارش به پرداخت شده
            await prisma.order.update({
                where: { id: orderId },
                data: {
                    status: "PAID",
                    refId: verifyRes.refId ? String(verifyRes.refId) : null, // شماره پیگیری بانک
                    downloadToken: downloadToken,
                }
            });
            
            // 4. کسر سهمیه کد تخفیف (اگر استفاده شده باشد)
            if (order.discountCodeId) {
                await prisma.discountCode.update({
                    where: { id: order.discountCodeId },
                    data: { usedCount: { increment: 1 } }
                });
            }

            // 5. ارسال پیامک اطلاع‌رسانی
            if (order.customerPhone) {
                // ارسال پیامک موفقیت به مشتری
                await sendOrderNotification(order.customerPhone, order.trackingCode || "N/A");
            }
            // ارسال پیامک فروش جدید به ادمین
            await sendAdminAlert(order.amount);

            // 6. هدایت به صفحه نتیجه موفق
            return redirect(`/payment/result?status=success&orderId=${orderId}`);
        } else {
            // ❌ پرداخت ناموفق بود
            return redirect(`/payment/result?status=failed&message=تراکنش توسط بانک تایید نشد`);
        }

    } catch (error) {
        console.error("Payment Verify Error:", error);
        return redirect(`/payment/result?status=failed&message=خطای فنی در پردازش پرداخت`);
    }
}