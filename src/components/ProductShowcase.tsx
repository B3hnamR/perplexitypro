"use client";

import { Zap } from "lucide-react";

export default function ProductShowcase() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* کانتینر عریض‌تر برای نمایش بهتر */}
            <div className="max-w-[95rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* تغییر گرید به 12 ستون برای کنترل دقیق‌تر سایز */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    
                    {/* Left: Text & Steps (سهم کمتر: 5 از 12) */}
                    <div className="text-right space-y-10 order-2 lg:order-1 lg:col-span-5">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold mb-6 border border-cyan-500/20">
                                <Zap size={12} fill="currentColor" />
                                بدون دردسر، بدون تحریم
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                                محیط کاربری <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">اصلی</span>
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
                                <div key={idx} className="flex gap-5">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-[#1e293b] border border-white/10 flex items-center justify-center font-bold text-white shadow-lg text-lg">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-xl mb-1">{step.title}</h4>
                                        <p className="text-gray-500 text-base">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Laptop Mockup (سهم بیشتر: 7 از 12) */}
                    <div className="relative w-full lg:col-span-7 order-1 lg:order-2">
                        <div className="group relative">
                            {/* Laptop Body */}
                            <div className="relative bg-[#0f172a] rounded-xl border border-white/10 shadow-2xl transition-transform duration-700 hover:scale-[1.02]">
                                
                                {/* Screen Header */}
                                <div className="h-7 md:h-10 bg-[#1e293b] rounded-t-xl border-b border-white/5 flex items-center px-5 gap-2.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                    <div className="ml-6 flex-1 bg-black/20 h-5 md:h-6 rounded-lg mx-auto max-w-lg hidden sm:block"></div>
                                </div>
                                
                                {/* Screen Content (Video) */}
                                <div className="relative aspect-video bg-black overflow-hidden rounded-b-xl">
                                    <video 
                                        className="w-full h-full object-cover"
                                        autoPlay 
                                        loop 
                                        muted 
                                        playsInline
                                        poster="/perplexity-pro-dark.png"
                                        style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                                    >
                                        <source src="/showcase.mp4" type="video/mp4" />
                                        مرورگر شما از ویدیو پشتیبانی نمی‌کند.
                                    </video>
                                </div>
                            </div>

                            {/* Laptop Base */}
                            <div className="absolute -bottom-4 md:-bottom-6 left-[5%] right-[5%] h-4 md:h-6 bg-[#1e293b] rounded-b-2xl border-t border-white/5 shadow-2xl z-[-1]"></div>
                            
                            {/* Reflection/Glow below laptop */}
                            <div className="absolute -bottom-20 left-10 right-10 h-20 bg-cyan-500/20 blur-[60px] rounded-full pointer-events-none"></div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}