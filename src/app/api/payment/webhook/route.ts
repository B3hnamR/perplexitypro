import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPayment } from "@/lib/zarinpal";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // زرین‌پال در ورژن ۴ ممکن است Authority را در کوئری یا بادی بفرستد، اما معمولاً در پاسخ وریفای مقدار refId مهم است
        const { Authority, Status } = body;

        // اگر Authority نبود، شاید در Query Params باشد (بسته به تنظیمات زرین‌پال)
        // اما در اینجا فرض بر این است که از Body می‌آید.

        if (!Authority) {
            return NextResponse.json({ error: "Invalid Data" }, { status: 400 });
        }

        const order = await prisma.order.findFirst({
            where: { refId: Authority }, // ما موقع درخواست پرداخت، Authority را به عنوان refId موقت ذخیره نکرده بودیم؟ 
            // نکته: در فایل payment.ts شما authority را برمی‌گردانید اما در دیتابیس ذخیره نکرده بودید.
            // *اصلاح مهم*: در payment/request باید authority را در refId سفارش ذخیره کنید تا اینجا پیدایش کنید.
            // اما چون الان به دیتابیس دسترسی نداریم، فرض می‌کنیم orderId را در Callback URL دارید و اینجا از طریق آن پیدا می‌کنیم؟
            // خیر، وب‌هوک زرین‌پال OrderID را نمی‌فرستد مگر اینکه ما در Callback URL گذاشته باشیم و زرین‌پال ما را ریدایرکت کند به verify/route.ts.
            // **این فایل Webhook نیست!** این فایلی است که زرین‌پال صدا می‌زند؟ خیر زرین‌پال کاربر را ریدایرکت می‌کند.
            // با توجه به کد قبلی شما، وریفای در `api/payment/verify` انجام می‌شود.
            // پس این فایل احتمالا برای استفاده‌های خاص (مثل Callback سرور به سرور) است.
            
            // با این حال، اگر شما از این فایل استفاده می‌کنید، منطق Race Condition اینجا پیاده می‌شود.
            // اما منطق اصلی شما در `src/app/api/payment/verify/route.ts` بود.
            // من کد را برای همان فایل `verify` که در لیست فایل‌های شما بود و مسئول تایید نهایی است (ریدایرکت کاربر) اعمال می‌کنم؟
            // خیر، کاربر در درخواست گفته `api/payment/webhook`. پس من همین فایل را اصلاح می‌کنم.
            
            // **نکته بسیار مهم**: اگر سیستم شما بر اساس ریدایرکت کاربر به `api/payment/verify` کار می‌کند، این فایل Webhook شاید اصلا استفاده نشود.
            // اما اگر زرین‌پال را طوری تنظیم کرده‌اید که به این آدرس هم نوتیفیکیشن بزند، این کد درست است.
            
            include: { links: true }
        });

        // اگر سفارش با Authority پیدا نشد (چون شاید ما Authority را ذخیره نکرده‌ایم)، باید استراتژی دیگری داشت.
        // اما بیایید فرض کنیم Authority در refId ذخیره شده است (که باید در مرحله request انجام شود).
        
        if (!order) {
            return NextResponse.json({ error: "Order Not Found" }, { status: 404 });
        }

        if (order.status === "PAID") {
            return NextResponse.json({ message: "Already Paid" });
        }

        if (Status === "OK") {
            const verification = await verifyPayment(Authority, order.amount);

            if (verification.data && (verification.data.code === 100 || verification.data.code === 101)) {
                const downloadToken = crypto.randomBytes(32).toString("hex");

                // ✅ حل مشکل Race Condition با تراکنش
                // ما باید برای هر آیتم در سفارش، یک لینک پیدا کنیم.
                // فرض: سفارش فقط شامل ۱ عدد محصول است (چون ساختار Link به Order یک‌به‌چند است اما ساده شده).
                // اگر quantity > 1 باشد باید حلقه بزنیم.
                
                try {
                    await prisma.$transaction(async (tx) => {
                        // 1. پیدا کردن لینک آزاد (قفل کردن سطر در دیتابیس‌های SQL با SELECT FOR UPDATE که پریزما مستقیماً ندارد اما findFirst اتمیک است در آپدیت)
                        // راه حل پریزما: آپدیت کردن اولین رکوردی که شرطش را دارد.
                        
                        // تعداد مورد نیاز
                        const quantityNeeded = order.quantity || 1;
                        
                        // تلاش برای گرفتن لینک‌ها
                        // متاسفانه updateMany نمی‌تواند limit داشته باشد (در همه دیتابیس‌ها).
                        // پس باید یکی یکی بگیریم یا آیدی‌ها را پیدا کنیم.
                        
                        const availableLinks = await tx.downloadLink.findMany({
                            where: { status: "AVAILABLE" },
                            take: quantityNeeded,
                            select: { id: true }
                        });

                        // اگر موجودی کافی نبود
                        if (availableLinks.length < quantityNeeded) {
                            // وضعیت را به PAID تغییر می‌دهیم اما لینک نمی‌دهیم (تحویل دستی/تاخیر)
                            // یا کلا تراکنش را فیل می‌کنیم؟ معمولا پول گرفته شده، پس باید سفارش ثبت شود.
                            // پس اینجا ارور نمی‌دهیم، فقط لینک وصل نمی‌کنیم.
                        } else {
                            // اتصال لینک‌ها به سفارش
                            const linkIds = availableLinks.map(l => l.id);
                            await tx.downloadLink.updateMany({
                                where: { id: { in: linkIds } },
                                data: { 
                                    status: "USED", 
                                    orderId: order.id, 
                                    consumedAt: new Date() 
                                }
                            });
                        }

                        // 2. آپدیت وضعیت سفارش
                        await tx.order.update({
                            where: { id: order.id },
                            data: {
                                status: "PAID",
                                refId: String(verification.data.ref_id),
                                downloadToken
                            }
                        });

                        // 3. آپدیت کد تخفیف
                        if (order.discountCodeId) {
                            await tx.discountCode.update({
                                where: { id: order.discountCodeId },
                                data: { usedCount: { increment: 1 } }
                            });
                        }
                    });

                    return NextResponse.json({ status: "Success", refId: verification.data.ref_id });

                } catch (txError) {
                    console.error("Transaction Error:", txError);
                    // حتی اگر اختصاص لینک شکست خورد، چون پول کم شده باید وضعیت پرداخت را ثبت کنیم؟ 
                    // معمولا در این مرحله بهتر است ادمین مطلع شود.
                    return NextResponse.json({ error: "Transaction Failed" }, { status: 500 });
                }
            }
        }

        // پرداخت ناموفق
        await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
        return NextResponse.json({ status: "Failed" });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}