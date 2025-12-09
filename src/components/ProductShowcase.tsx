"use client";

import { Zap } from "lucide-react";

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
                    {/* تغییر مهم: حذف کلاس‌های 3D (rotate-y) برای افزایش شارپنس تصویر */}
                    <div className="relative w-full max-w-2xl mx-auto lg:mr-0 group">
                        
                        {/* Laptop Body */}
                        <div className="relative bg-[#0f172a] rounded-xl border border-white/10 shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                            
                            {/* Screen Header */}
                            <div className="h-6 md:h-8 bg-[#1e293b] rounded-t-xl border-b border-white/5 flex items-center px-4 gap-2">
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/50"></div>
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/50"></div>
                                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/50"></div>
                                <div className="ml-4 flex-1 bg-black/20 h-4 md:h-5 rounded-md mx-auto max-w-xs hidden sm:block"></div>
                            </div>
                            
                            {/* Screen Content (Video) */}
                            <div className="relative aspect-video bg-black overflow-hidden rounded-b-xl">
                                <video 
                                    className="w-full h-full object-cover" // حذف opacity-90
                                    autoPlay 
                                    loop 
                                    muted 
                                    playsInline
                                    poster="/perplexity-pro-dark.png"
                                    // اضافه کردن این استایل برای جلوگیری از مات شدن در کروم
                                    style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
                                >
                                    <source src="/showcase.mp4" type="video/mp4" />
                                    مرورگر شما از ویدیو پشتیبانی نمی‌کند.
                                </video>
                                
                                {/* حذف لایه گرادینت تیره روی ویدیو برای شفافیت حداکثری */}
                            </div>
                        </div>

                        {/* Laptop Base */}
                        <div className="absolute -bottom-3 md:-bottom-4 left-[5%] right-[5%] h-3 md:h-4 bg-[#1e293b] rounded-b-xl border-t border-white/5 shadow-2xl z-[-1]"></div>
                    </div>

                </div>
            </div>
        </section>
    );
}