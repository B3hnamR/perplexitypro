"use client";

import { XCircle, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // برای رفرش کردن

export default function PaymentFailedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans select-none">
            <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                        <XCircle size={48} className="text-red-500" />
                    </div>
                </div>
                
                <h1 className="text-2xl font-black text-white mb-4">پرداخت ناموفق بود</h1>
                <p className="text-gray-400 mb-8 leading-relaxed text-sm">
                    متاسفانه در پردازش پرداخت شما مشکلی پیش آمد. اگر مبلغی از حساب شما کسر شده، طی ۷۲ ساعت آینده به صورت خودکار به حساب شما بازخواهد گشت.
                </p>

                <div className="space-y-3">
                    {/* دکمه تلاش مجدد */}
                    <button 
                        onClick={() => router.back()} // برگشت به صفحه قبل (درگاه) یا سبد خرید
                        className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-cyan-500/20"
                    >
                        <RefreshCw size={18} /> تلاش مجدد
                    </button>
                    
                    {/* دکمه بازگشت به خانه */}
                    <Link 
                        href="/" 
                        className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white py-3 rounded-xl font-medium transition-colors"
                    >
                        بازگشت به صفحه اصلی <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
}