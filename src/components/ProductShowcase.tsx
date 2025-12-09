"use client";

import { CheckCircle, Zap } from "lucide-react";
import Image from "next/image";

export default function ProductShowcase() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left: Text & Steps */}
                    <div className="text-right space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold mb-4 border border-cyan-500/20">
                                <Zap size={12} fill="currentColor" />
                                بدون دردسر، بدون تحریم
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
                                محیط کاربری <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">اصلی</span>، بدون واسطه
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                شما یک اکانت اشتراکی بی‌کیفیت نمی‌خرید. شما لایسنس قانونی برای اکانت شخصی خودتان دریافت می‌کنید. تمام تاریخچه جستجوها و فایل‌های شما محرمانه و شخصی باقی می‌ماند.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { title: "خرید آنی", desc: "پرداخت امن و دریافت کد لایسنس در لحظه" },
                                { title: "فعال‌سازی ساده", desc: "وارد اکانت خود شوید و کد را وارد کنید" },
                                { title: "شروع استفاده", desc: "دسترسی نامحدود به GPT-5 و Claude 3" },
                            ].map((step, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1e293b] border border-white/10 flex items-center justify-center font-bold text-white shadow-lg">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">{step.title}</h4>
                                        <p className="text-gray-500 text-sm">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Laptop Mockup */}
                    <div className="relative group perspective-1000">
                        {/* Laptop Body */}
                        <div className="relative bg-[#0f172a] rounded-xl border border-white/10 shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02] group-hover:rotate-y-2">
                            {/* Screen Header (Mac style) */}
                            <div className="h-8 bg-[#1e293b] rounded-t-xl border-b border-white/5 flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                <div className="ml-4 flex-1 bg-black/20 h-5 rounded-md mx-auto max-w-xs"></div>
                            </div>
                            
                            {/* Screen Content */}
                            <div className="relative aspect-[16/10] bg-black overflow-hidden rounded-b-xl">
                                {/* ⚠️ اینجا عکس محیط برنامه رو بزارید */}
                                {/* اگر فایل ندارید، این عکس پیش‌فرض لود میشه */}
                                <Image 
                                    src="/perplexity-pro-dark.png" 
                                    alt="Perplexity Interface" 
                                    fill 
                                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                />
                                
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-50"></div>
                                
                                {/* Play Button Mockup (Optional) */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl animate-pulse">
                                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Laptop Base (Keyboard area) */}
                        <div className="absolute -bottom-4 left-[5%] right-[5%] h-4 bg-[#1e293b] rounded-b-xl transform perspective-origin-top rotate-x-12 border-t border-white/5 shadow-2xl z-[-1]"></div>
                    </div>

                </div>
            </div>
        </section>
    );
}