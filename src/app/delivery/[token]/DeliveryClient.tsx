"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, ChevronDown, ChevronUp, BookOpen } from "lucide-react";

interface DeliveryClientProps {
    links: { id: string; url: string }[];
}

export default function DeliveryClient({ links }: DeliveryClientProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="space-y-8">
            {/* Links List */}
            <div className="space-y-4 text-left">
                <h3 className="text-white font-bold text-right mb-4 text-lg">📦 لایسنس‌های شما:</h3>
                
                {links.map((link, idx) => (
                    <div key={idx} className="bg-[#0f172a] border border-cyan-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 group hover:bg-[#0f172a]/80 transition-all shadow-lg shadow-cyan-500/5">
                        <div className="flex-1 w-full min-w-0 overflow-hidden">
                            <p className="text-xs text-cyan-400 mb-1.5 text-right font-medium">لایسنس اختصاصی</p>
                            <code className="block text-white font-mono text-sm sm:text-base dir-ltr bg-black/20 p-2 rounded-lg border border-white/5 break-all">
                                {link.url}
                            </code>
                        </div>
                        
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button 
                                onClick={() => handleCopy(link.url, idx)}
                                className="flex-1 sm:flex-none bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white p-3 rounded-lg transition-colors border border-white/10 flex items-center justify-center gap-2 text-sm font-medium"
                                title="کپی لینک"
                            >
                                {copiedIndex === idx ? (
                                    <><Check size={18} className="text-emerald-400" /> <span className="sm:hidden">کپی شد</span></>
                                ) : (
                                    <><Copy size={18} /> <span className="sm:hidden">کپی</span></>
                                )}
                            </button>
                            
                            <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-none bg-cyan-500 text-white p-3 rounded-lg hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 text-sm font-bold"
                            >
                                <ExternalLink size={18} />
                                <span className="sm:hidden">باز کردن</span>
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Guide Accordion */}
            <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#1e293b]/50">
                <button
                    onClick={() => setIsGuideOpen(!isGuideOpen)}
                    className="w-full flex items-center justify-between p-5 text-right hover:bg-white/5 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                            <BookOpen size={20} />
                        </div>
                        <span className="font-bold text-white text-lg">آموزش فعال‌سازی (حتما بخوانید)</span>
                    </div>
                    {isGuideOpen ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </button>
                
                {isGuideOpen && (
                    <div className="p-6 border-t border-white/5 bg-[#0f172a]/30 text-gray-300 leading-loose text-sm animate-fade-in">
                        <p className="mb-4">
                            کاربر گرامی، برای فعال‌سازی اشتراک خود لطفاً مراحل زیر را با دقت انجام دهید:
                        </p>
                        <ul className="list-disc list-inside space-y-2 marker:text-cyan-500">
                            <li>ابتدا فیلترشکن خود را روشن کنید.</li>
                            <li>روی دکمه <strong>باز کردن</strong> در بالا کلیک کنید تا وارد صفحه فعال‌سازی شوید.</li>
                            <li>اگر از قبل در سایت Perplexity اکانت دارید، لاگین کنید. در غیر این صورت ثبت‌نام کنید.</li>
                            <li>پس از ورود، لایسنس به صورت خودکار روی اکانت شما اعمال می‌شود.</li>
                            <li>در صورتی که با خطا مواجه شدید، لینک را کپی کرده و در یک مرورگر دیگر امتحان کنید.</li>
                        </ul>
                        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200 text-xs">
                            <strong>نکته مهم:</strong> این لینک یک‌بار مصرف است و فقط برای یک اکانت قابل استفاده می‌باشد.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}