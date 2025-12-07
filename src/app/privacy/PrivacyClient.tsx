"use client";

import Footer from "@/components/Footer";

export default function PrivacyClient() {
    return (
        <main className="min-h-screen bg-[#0f172a] text-white font-sans flex flex-col">
            <div className="flex-1 w-full pt-32 pb-20 max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-black mb-8">سیاست حفظ حریم خصوصی</h1>
                
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-8 shadow-xl text-gray-300 leading-8">
                    <p className="mb-6">
                        ما در Perplexity Pro به حریم خصوصی شما احترام می‌گذاریم و متعهد به حفاظت از اطلاعات شخصی شما هستیم. این بیانیه توضیح می‌دهد که چه اطلاعاتی را جمع‌آوری می‌کنیم و چگونه از آن‌ها استفاده می‌کنیم.
                    </p>
                    
                    <h3 className="text-lg font-bold text-white mt-6 mb-2">اطلاعاتی که دریافت می‌کنیم</h3>
                    <p>برای پردازش سفارشات، ما به شماره موبایل و (اختیاری) ایمیل شما نیاز داریم. این اطلاعات صرفاً برای ارسال کد لایسنس، پیگیری سفارش و اطلاع‌رسانی‌های ضروری استفاده می‌شود.</p>

                    <h3 className="text-lg font-bold text-white mt-6 mb-2">امنیت اطلاعات</h3>
                    <p>تمامی اطلاعات کاربران در سرورهای امن نگهداری شده و پسوردها به صورت رمزنگاری شده (Hashed) ذخیره می‌شوند. ما اطلاعات شما را با هیچ شخص ثالثی به اشتراک نمی‌گذاریم، مگر با حکم قانونی.</p>
                </div>
            </div>
            <Footer />
        </main>
    );
}