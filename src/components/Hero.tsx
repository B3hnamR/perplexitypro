"use client";

import { Zap, Sparkles } from "lucide-react";
import Image from "next/image"; // ✅ ایمپورت جدید

interface HeroProps {
    onPreOrder: () => void;
}

export default function Hero({ onPreOrder }: HeroProps) {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in-up">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                    </span>
                    نسخه حرفه‌ای در دسترس است
                </div>

                {/* LOGO IMAGE - Optimized */}
                <div className="flex justify-center items-center mb-8 relative animate-fade-in">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-cyan-500/20 blur-[50px] rounded-full"></div>
                    <div className="relative w-full max-w-[600px] h-auto aspect-[3/1]">
                        <Image
                            src="/perplexity-pro-logo.png"
                            alt="Perplexity Pro Logo"
                            fill
                            priority // ✅ لود سریع برای LCP
                            className="object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:drop-shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-500"
                        />
                    </div>
                </div>

                {/* ✅ تگ H1 برای سئو */}
                <h1 className="sr-only">خرید اشتراک Perplexity Pro با دسترسی به GPT-5 و Claude 3</h1>

                <p className="mt-8 max-w-2xl mx-auto text-xl text-gray-400 mb-12 leading-relaxed font-light">
                    تجربه‌ای فراتر از جستجوی معمولی. با خرید اشتراک پرپلکسیتی، به صورت همزمان به <span className="text-white font-medium">GPT-5.1</span>، <span className="text-white font-medium">Claude Sonnet 4.5</span> و <span className="text-white font-medium">Gemini 3 Pro</span> دسترسی داشته باشید و پاسخ‌های دقیق‌تر دریافت کنید.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
                    <button onClick={onPreOrder} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 text-lg">
                        <Zap size={22} />
                        خرید اشتراک حرفه‌ای
                    </button>
                    <a href="#demo" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-3 text-lg">
                        <Sparkles size={22} className="text-cyan-400" />
                        تست رایگان
                    </a>
                </div>

                {/* Floating Icons */}
                <div className="mt-24 relative max-w-5xl mx-auto h-24 md:h-32 hidden sm:block">
                    <div className="absolute left-0 top-2 animate-float-slow opacity-80 bg-[#1e293b]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs md:text-sm text-gray-300 shadow-lg hover:border-cyan-500/30 transition-colors">Claude Sonnet 4.5</div>
                    <div className="absolute left-[18%] bottom-0 animate-float-delayed opacity-80 bg-[#1e293b]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs md:text-sm text-gray-300 shadow-lg hover:border-cyan-500/30 transition-colors">GPT-5.1</div>
                    <div className="absolute left-[40%] top-6 animate-float opacity-100 bg-[#1e293b] px-5 py-3 rounded-2xl border border-cyan-500/40 text-sm md:text-base text-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]">Gemini 3 Pro</div>
                    <div className="absolute right-[25%] bottom-4 animate-float-slow-reverse opacity-80 bg-[#1e293b]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs md:text-sm text-gray-300 shadow-lg hover:border-cyan-500/30 transition-colors">Grok 4.1</div>
                    <div className="absolute right-0 top-8 animate-float-delayed opacity-80 bg-[#1e293b]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs md:text-sm text-gray-300 shadow-lg hover:border-cyan-500/30 transition-colors">Kimi K2 Thinking</div>
                </div>
            </div>
        </section>
    );
}