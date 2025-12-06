"use client";

import { MessageSquare, Star } from "lucide-react";

const reviews = [
    {
        name: "رضا کریمی",
        role: "تولیدکننده محتوا",
        text: "دیگه نیازی نیست بین ابزارهای مختلف سوییچ کنم. همه مدل‌های هوش مصنوعی رو یکجا دارم. کیفیت خروجی‌ها فوق‌العاده‌ست.",
        stars: 5
    },
    {
        name: "سارا جلالی",
        role: "محقق و دانشجو",
        text: "برای پایان‌نامم نیاز به تحلیل مقالات زیادی داشتم. قابلیت آپلود فایل و تحلیل دقیق پرپلکسیتی نجاتم داد. فعال‌سازی هم که آنی بود.",
        stars: 5
    },
    {
        name: "علی محمدی",
        role: "برنامه‌نویس ارشد",
        text: "از وقتی اشتراک پرو رو گرفتم، سرعت کدنویسیم دو برابر شده. دسترسی همزمان به GPT-5 و Claude جدید با این قیمت واقعاً باورنکردنیه.",
        stars: 5
    }
];

export default function TestimonialsSection() {
    return (
        <section id="reviews" className="py-24 bg-[#0f172a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-white mb-4">نظرات کاربران ما</h2>
                    <p className="text-gray-400">ببینید دیگران درباره تجربه استفاده از Perplexity Pro چه می‌گویند</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, idx) => (
                        <div key={idx} className="bg-[#1e293b]/40 p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300">
                            <div className="absolute -top-4 -left-4 text-cyan-500/10 transform rotate-12 group-hover:scale-110 transition-transform duration-500">
                                <MessageSquare size={80} fill="currentColor" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-gray-300 leading-relaxed mb-8 min-h-[80px] pl-8">
                                    "{review.text}"
                                </p>
                                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                                    <div>
                                        <h4 className="font-bold text-white text-lg">{review.name}</h4>
                                        <span className="text-cyan-400 text-xs font-medium">{review.role}</span>
                                    </div>
                                    <div className="flex text-yellow-500">
                                        {[...Array(review.stars)].map((_, i) => (
                                            <Star key={i} size={16} fill="currentColor" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}