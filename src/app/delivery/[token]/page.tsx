import { prisma } from "@/lib/db";
import { CheckCircle, Home, AlertTriangle } from "lucide-react";
import Link from "next/link";
import DeliveryClient from "./DeliveryClient";

interface PageProps {
    params: Promise<{ token: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DeliveryPage({ params, searchParams }: PageProps) {
    const { token } = await params;
    const { nostock } = await searchParams;

    const order = await prisma.order.findFirst({
        where: { downloadToken: token, status: "PAID" },
        include: { links: true }
    });

    if (!order) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white p-4">
                <h1 className="text-2xl font-bold mb-2 text-red-400">لینک نامعتبر</h1>
                <p className="text-gray-400 mb-6">اطلاعات سفارش یافت نشد.</p>
                <Link href="/" className="px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">بازگشت به خانه</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] py-12 px-4 flex items-center justify-center font-sans">
            <div className="w-full max-w-3xl">
                <div className="bg-[#1e293b] border border-emerald-500/30 rounded-[2rem] p-6 md:p-10 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500"></div>
                    
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                        <CheckCircle size={40} className="text-emerald-400" />
                    </div>

                    <h1 className="text-2xl md:text-3xl font-black text-white mb-3">پرداخت موفقیت‌آمیز بود</h1>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto leading-relaxed">
                        سفارش شما با موفقیت ثبت و پردازش شد. اطلاعات لایسنس در پایین همین صفحه قرار دارد.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8 bg-[#0f172a]/50 p-4 rounded-2xl border border-white/5">
                        <div>
                            <span className="text-xs text-gray-500 block mb-1">کد پیگیری</span>
                            <span className="text-lg font-mono font-bold text-white tracking-wider">{order.trackingCode}</span>
                        </div>
                        <div className="border-r border-white/10">
                            <span className="text-xs text-gray-500 block mb-1">مبلغ پرداختی</span>
                            <span className="text-lg font-bold text-cyan-400">{order.amount.toLocaleString("fa-IR")} <span className="text-xs text-gray-500 font-normal">تومان</span></span>
                        </div>
                    </div>

                    {order.links && order.links.length > 0 ? (
                        <DeliveryClient links={order.links} />
                    ) : (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-5 rounded-xl flex items-start gap-4 text-right mb-8">
                            <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-1" />
                            <div>
                                <p className="text-yellow-400 font-bold text-sm mb-1">در حال پردازش...</p>
                                <p className="text-gray-400 text-xs leading-relaxed">
                                    {nostock ? "متاسفانه موجودی انبار برای تحویل آنی کافی نبود. لایسنس تا ساعاتی دیگر به ایمیل/موبایل شما ارسال می‌شود." : "لایسنس شما به زودی ارسال می‌شود."}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-center">
                        <Link href="/" className="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all flex items-center gap-2 hover:scale-105 border border-white/5">
                            <Home size={18} />
                            بازگشت به فروشگاه
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}