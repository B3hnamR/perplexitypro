"use client";

import { 
    Cpu, Image as ImageIcon, Link2, Search, 
    Database, Sparkles, Layers, FileCode
} from "lucide-react";

const specs = [
    {
        title: "هوش مصنوعی و مدل‌ها",
        icon: Cpu,
        shortDesc: "دسترسی همزمان به ۶ مدل زبانی برتر جهان",
        popupItems: [
            "GPT-5.1 (OpenAI)",
            "Claude Sonnet 4.5 (Anthropic)",
            "Gemini 3 Pro (Google)",
            "Grok 4.1 (xAI)",
            "Sonar Deep Research (Perplexity)",
            "Kimi K2 Thinking"
        ]
    },
    {
        title: "تولید تصویر حرفه‌ای",
        icon: ImageIcon,
        shortDesc: "موتورهای قدرتمند برای خلق تصاویر وکتور و رئال",
        popupItems: [
            "Nano Banana",
            "Seedream 4.0",
            "GPT Image 1",
            "FLUX.1",
            "ویرایش و اصلاح تصاویر"
        ]
    },
    {
        title: "منابع دانش (Connectors)",
        icon: Link2,
        shortDesc: "اتصال مستقیم به دیتابیس‌های تخصصی",
        popupItems: [
            "Yelp (کسب‌وکار و نظرات)",
            "Google Maps (مکان‌یابی)",
            "LinkedIn (اطلاعات حرفه‌ای)",
            "Wolfram|Alpha (محاسبات علمی)",
            "Crunchbase (داده‌های مالی)"
        ]
    },
    {
        title: "حالت‌های جستجو",
        icon: Search,
        shortDesc: "ابزارهای تخصصی برای نیازهای مختلف",
        popupItems: [
            "Deep Research (تحقیق جامع)",
            "Reasoning (استدلال چندمرحله‌ای)",
            "Academic (جستجو در مقالات)",
            "Writing Mode (تولید متن خلاق)",
            "Social Search (Reddit & YouTube)"
        ]
    },
    {
        title: "تحلیل داده و فایل",
        icon: Database,
        shortDesc: "آپلود و آنالیز بدون محدودیت",
        popupItems: [
            "آپلود نامحدود (PDF, CSV, Img)",
            "تحلیل داده‌های مالی",
            "رونویسی فایل‌های صوتی",
            "Code Interpreter (اجرای کد)",
            "ساخت داشبورد و نمودار"
        ]
    },
    {
        title: "سازماندهی و پروفایل",
        icon: Layers,
        shortDesc: "شخصی‌سازی تجربه کاربری",
        popupItems: [
            "AI Profile (تنظیمات شخصی)",
            "Custom Instructions",
            "Collections (دسته‌بندی جستجوها)",
            "Spaces (فضای کاری اشتراکی)",
            "Location Awareness"
        ]
    }
];

export default function FullSpecsSection() {
    return (
        <section className="py-24 relative bg-[#0b1120] overflow-visible">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold mb-6 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                        <Sparkles size={14} />
                        جعبه‌ابزار نهایی
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        قدرت <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">بی‌نهایت</span> در دستان شما
                    </h2>
                    {/* متن راهنما: بولد و چشمک‌زن */}
                    <p className="text-gray-400 text-sm md:text-base font-bold animate-pulse">
                        برای مشاهده جزئیات فنی، نشانگر موس را روی کارت‌ها نگه دارید.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {specs.map((spec, idx) => (
                        <div key={idx} className="group relative">
                            <div className="h-full p-6 rounded-3xl bg-[#1e293b]/50 border border-white/5 hover:border-cyan-500/30 hover:bg-[#1e293b] transition-all duration-300 cursor-help flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-white/10 flex items-center justify-center text-cyan-400 shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                    <spec.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">{spec.title}</h3>
                                    <p className="text-xs text-gray-400 leading-relaxed">{spec.shortDesc}</p>
                                </div>
                            </div>

                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-[#0f172a] border border-cyan-500/30 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-50 p-5 pointer-events-none">
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0f172a] border-b border-r border-cyan-500/30 rotate-45"></div>
                                
                                <h4 className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b border-white/10 flex items-center gap-2">
                                    <FileCode size={14}/>
                                    مشخصات فنی
                                </h4>
                                <ul className="space-y-2.5">
                                    {spec.popupItems.map((item, i) => (
                                        <li key={i} className="text-gray-300 text-xs flex items-center gap-2 font-medium dir-ltr text-right">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500 flex-shrink-0"></div>
                                            <span className="text-right w-full">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}