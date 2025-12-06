"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
    {
        question: "اشتراک Perplexity Pro چه مزیتی دارد؟",
        answer: "دسترسی به جدیدترین مدل‌های جهان مثل GPT-5.1، Claude Sonnet 4.5 و Gemini 3 Pro، سرعت پاسخگویی بالاتر و قابلیت آپلود فایل‌های حجیم برای آنالیز.",
    },
    {
        question: "تحویل و فعال‌سازی چطور انجام می‌شود؟",
        answer: "بلافاصله پس از پرداخت، لایسنس اختصاصی به ایمیل شما ارسال می‌شود و می‌توانید روی اکانت شخصی خودتان آن را فعال کنید.",
    },
    {
        question: "آیا می‌توانم اشتراک را لغو یا تمدید کنم؟",
        answer: "بله، در هر زمان می‌توانید اشتراک خود را مدیریت کنید. برای تمدید نیز می‌توانید از همین پنل اقدام کنید.",
    },
    {
        question: "پرداخت امن است؟",
        answer: "بله، تمامی پرداخت‌ها از طریق درگاه‌های امن بانکی (زرین‌پال) انجام می‌شود و اطلاعات شما کاملاً محفوظ است.",
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (idx: number) => {
        setOpenIndex((prev) => (prev === idx ? null : idx));
    };

    return (
        <section id="faq" className="py-24 bg-[#0b1120]">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm mb-4">
                        سوالات متداول
                    </div>
                    <h2 className="text-3xl font-black text-white">قبل از خرید، همه چیز را روشن کنید</h2>
                </div>
                
                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={index} className="border border-white/10 rounded-2xl bg-[#1e293b]/30 overflow-hidden transition-all duration-300 hover:border-cyan-500/30">
                                <button 
                                    onClick={() => toggle(index)}
                                    className="flex items-center justify-between w-full p-6 text-right focus:outline-none"
                                >
                                    <span className="font-bold text-white text-lg">{faq.question}</span>
                                    {isOpen ? <ChevronUp className="text-cyan-400" /> : <ChevronDown className="text-gray-400" />}
                                </button>
                                <div 
                                    className={`px-6 text-gray-400 text-sm leading-relaxed overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    {faq.answer}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}