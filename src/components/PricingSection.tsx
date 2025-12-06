"use client";

import { useState, useEffect } from "react";
import { Check, Zap, Brain } from "lucide-react";
import { useCart } from "@/context/CartContext";

const UsageProgressCard = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setProgress(75), 500);
        return () => clearTimeout(timer);
    }, []);

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative max-w-4xl mx-auto mb-24 animate-fade-in">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[2.5rem] blur-xl opacity-30"></div>
            <div className="relative bg-[#0f172a] border border-white/10 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden">
                
                <div className="flex items-center gap-6 z-10 flex-col md:flex-row text-center md:text-right">
                    <div className="relative w-32 h-32 flex-shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r={radius} stroke="#1e293b" strokeWidth="12" fill="none" />
                            <circle
                                cx="60" cy="60" r={radius}
                                stroke="url(#gradient)"
                                strokeWidth="12"
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#06b6d4" />
                                    <stop offset="100%" stopColor="#2563eb" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                            <Brain size={28} className="text-cyan-400 mb-1 animate-pulse" />
                            <span className="text-2xl font-bold">{progress}%</span>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                            استفاده از مدل‌های حرفه‌ای
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                            </span>
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                            با اشتراک Pro، شما به طور نامحدود به قوی‌ترین مدل‌های هوش مصنوعی جهان دسترسی دارید. قدرت واقعی را آزاد کنید.
                        </p>
                    </div>
                </div>

                <button className="relative group w-full md:w-auto flex-shrink-0">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                    <div className="relative px-8 py-4 bg-[#0f172a] rounded-xl leading-none flex items-center justify-center gap-3 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-600 transition-all duration-200">
                        <Zap size={24} className="text-cyan-400 group-hover:text-white transition-colors" />
                        <span className="text-white font-bold text-lg">ارتقا به نسخه حرفه‌ای</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

interface PricingSectionProps {
    product?: { id?: string; name?: string | null; price?: number | null } | null;
}

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
                                    "دسترسی نامحدود به GPT-5.1 و Claude 4.5",
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
                            
                            <p className="text-center text-xs text-gray-500 mt-6">
                                گارانتی بازگشت وجه ۷ روزه در صورت نارضایتی
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}