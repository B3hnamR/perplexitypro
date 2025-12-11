import { prisma } from "@/lib/db";
import { paymentProvider } from "@/lib/payment";
import { sendAdminAlert, sendOrderNotification } from "@/lib/sms";
import { generateLicenseLinks } from "@/lib/license-manager"; // فرضی: تابعی که لینک می سازد
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

// چون متد GET است و Callback می شود، باید داینامیک باشد
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const gateway = searchParams.get("gateway") as "ZARINPAL" | "ZIBAL";
    const orderId = searchParams.get("orderId");
    
    // پارامترهای برگشتی از درگاه‌ها
    const authority = searchParams.get("Authority") || searchParams.get("trackId"); // زرین‌پال Authority میدهد، زیبال trackId
    const status = searchParams.get("Status"); // زرین‌پال
    const success = searchParams.get("success"); // زیبال (1 یا 0)

    // بررسی اولیه وضعیت (کنسل شدن توسط کاربر)
    const isCanceled = (gateway === "ZARINPAL" && status !== "OK") || (gateway === "ZIBAL" && success !== "1");

    if (!orderId || !authority || isCanceled) {
        return redirect(`/payment/result?status=failed&message=پرداخت توسط کاربر لغو شد`);
    }

    try {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) return redirect("/?error=order_not_found");
        
        // اگر قبلا پرداخت شده، هدایت کن به صفحه موفق
        if (order.status === "PAID") {
            return redirect(`/payment/result?status=success&orderId=${orderId}`);
        }

        // 1. تایید نهایی با درگاه
        const verifyRes = await paymentProvider.verify({
            gateway,
            amount: order.amount,
            authority: authority
        });

        if (verifyRes.success) {
            // 2. پرداخت موفق! آپدیت سفارش
            
            // تولید توکن دانلود (اگر قبلا نداشت)
            const downloadToken = order.downloadToken || Math.random().toString(36).substring(7);

            await prisma.order.update({
                where: { id: orderId },
                data: {
                    status: "PAID",
                    refId: verifyRes.refId ? String(verifyRes.refId) : null,
                    downloadToken: downloadToken,
                    // customData: JSON.stringify({ cardPan: verifyRes.cardPan }) // ذخیره شماره کارت (اختیاری)
                }
            });
            
            // 3. کسر از کد تخفیف (اگر استفاده شده)
            if (order.discountCodeId) {
                await prisma.discountCode.update({
                    where: { id: order.discountCodeId },
                    data: { usedCount: { increment: 1 } }
                });
            }

            // 4. ایجاد لینک‌های لایسنس (اگر سیستم اتوماتیک دارید)
            // await generateLicenseLinks(orderId); 
            // چون سیستم شما لینک‌ها را دستی یا از قبل دارد، اینجا لاجیک تحویل را می‌گذارید.
            // در حال حاضر شما لینک‌ها را دستی در ادمین اضافه می‌کنید یا اتوماتیک؟
            // فرض می‌کنیم لینک‌ها در مرحله delivery هندل می‌شوند.

            // 5. ارسال پیامک
            if (order.customerPhone) {
                await sendOrderNotification(order.customerPhone, order.trackingCode || "N/A");
            }
            await sendAdminAlert(order.amount);

            return redirect(`/payment/result?status=success&orderId=${orderId}`);
        } else {
            return redirect(`/payment/result?status=failed&message=تراکنش تایید نشد`);
        }

    } catch (error) {
        console.error("Payment Verify Error:", error);
        return redirect(`/payment/result?status=failed&message=خطای سیستمی`);
    }
}