"use client";

import { useState, useEffect } from "react";
import { Check, Zap, Brain } from "lucide-react";
import { useCart } from "@/context/CartContext";

// کامپوننت داخلی
const UsageProgressCard = () => {
    return (
        <div className="relative max-w-4xl mx-auto mb-24 animate-fade-in">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[2.5rem] blur-xl opacity-30"></div>
            <div className="relative bg-[#0f172a] border border-white/10 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden group">
                
                {/* پس‌زمینه ساده (بدون عکس خارجی که ارور ندهد) */}
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] group-hover:bg-cyan-500/20 transition-all duration-1000"></div>

                <div className="z-10 flex-1 text-center md:text-right">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-4">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        فعال‌سازی آنی و خودکار
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight">
                        چرا محدودیت؟ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">آزادانه</span> جستجو کنید.
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                        نسخه رایگان فقط نوک کوه یخ است. با نسخه پرو، موتور جستجوی شما به یک ابررایانه تبدیل می‌شود. دسترسی نامحدود به برترین مدل های هوش مصنوعی، تحلیل فایل‌های سنگین و جستجوی عمیق بدون وقفه.
                    </p>
                </div>

                <div className="relative z-10 flex-shrink-0">
                    <div className="w-full md:w-auto bg-white/5 border border-white/10 rounded-2xl p-1 flex items-center backdrop-blur-md">
                         <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg shadow-lg flex items-center gap-2">
                            <Zap size={20} className="fill-white" />
                            قدرت نهایی
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface PricingSectionProps {
    product?: { id?: string; name?: string | null; price?: number | null } | null;
}

// ✅ حتماً export default باشد
export default function PricingSection({ product }: PricingSectionProps) {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);

    const price = product?.price ?? 398000;
    const name = product?.name || "اشتراک Perplexity Pro";
    const productId = product?.id || "perplexity-pro-1year";

    const handleAddToCart = () => {
        addItem({ id: productId, name, price });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <section id="pricing" className="py-24 relative overflow-hidden bg-[#0b1220]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <UsageProgressCard />

                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-white mb-4">انتخاب طرح</h2>
                    <p className="text-xl text-gray-400">بهترین ابزار هوش مصنوعی جهان را با قیمتی استثنایی تجربه کنید</p>
                </div>

                <div className="flex justify-center">
                    <div className="relative w-full max-w-md">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-[2.5rem] blur opacity-75 animate-pulse"></div>
                        
                        <div className="relative bg-[#0f172a] rounded-[2rem] p-8 sm:p-12 border border-white/10 shadow-2xl">
                            <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2">
                                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                                    پیشنهاد ویژه
                                </span>
                            </div>

                            <div className="text-center mb-10 mt-4">
                                <h3 className="text-2xl font-bold text-white mb-2">اشتراک یک‌ساله</h3>
                                <div className="flex items-center justify-center gap-1 text-cyan-400 my-4">
                                    <span className="text-5xl font-black tracking-tight">{price.toLocaleString("fa-IR")}</span>
                                    <span className="text-xl font-medium text-gray-400 mt-4">تومان</span>
                                </div>
                                <p className="text-gray-400 text-sm">دسترسی کامل برای ۱۲ ماه</p>
                            </div>

                            <div className="space-y-4 mb-10">
                                {[
                                    "دسترسی نامحدود به مدل‌های جدید",
                                    "جستجوی حرفه‌ای با Copilot",
                                    "آپلود فایل و تحلیل داده (PDF, CSV)",
                                    "دسترسی به API (محدود)",
                                    "پشتیبانی اختصاصی ۲۴/۷"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-right">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                            <Check size={14} className="text-cyan-400" />
                                        </div>
                                        <span className="text-gray-300 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={handleAddToCart}
                                disabled={added}
                                className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-bold text-lg shadow-[0_4px_20px_rgba(6,182,212,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {added ? "به سبد اضافه شد ✓" : "افزودن به سبد خرید"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}