"use client";

import Footer from "@/components/Footer";

export default function TermsClient() {
    return (
        <main className="min-h-screen bg-[#0f172a] text-white font-sans flex flex-col">
            <div className="flex-1 w-full pt-32 pb-20 max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-black mb-8">قوانین و مقررات</h1>
                
                <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-8 shadow-xl space-y-8 text-gray-300 leading-8 text-justify">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">۱. تعاریف</h2>
                        <p>«سایت» به معنی وب‌سایت Perplexity Pro با دامنه perplexitypro.ir می‌باشد. «کاربر» به هر شخصی گفته می‌شود که در سایت ثبت‌نام کرده یا خریدی انجام دهد.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">۲. شرایط عمومی</h2>
                        <p>ورود کاربران به وب‌سایت و استفاده از خدمات ارائه شده به معنای آگاه بودن و پذیرفتن شرایط و قوانین و همچنین نحوه استفاده از سرویس‌ها و خدمات است. ثبت سفارش نیز در هر زمان به معنی پذیرفتن کامل کلیه شرایط و قوانین از سوی کاربر است.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">۳. تحویل محصول</h2>
                        <p>محصولات این فروشگاه به صورت «کد لایسنس» یا «لینک فعال‌سازی» می‌باشند که بلافاصله پس از پرداخت موفق، به صورت سیستمی به کاربر نمایش داده شده و همچنین پیامک/ایمیل می‌شوند. مسئولیت حفظ و نگهداری کد لایسنس پس از تحویل بر عهده کاربر است.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">۴. حق انصراف و بازگشت وجه</h2>
                        <p>طبق ماده ۳۷ قانون تجارت الکترونیک، مشتری به مدت ۷ روز کاری از حق انصراف برخوردار است. با این حال، با توجه به ماهیت «دیجیتال و مصرفی» بودن کدهای لایسنس:</p>
                        <ul className="list-disc list-inside mt-2 space-y-2 marker:text-cyan-500">
                            <li>در صورتی که کد لایسنس تحویل داده شده باشد و توسط کاربر <strong>مشاهده یا استفاده شده باشد</strong>، امکان بازپس‌گیری وجود ندارد.</li>
                            <li>اگر کد لایسنس مشکلی داشته باشد (مانند خطای نامعتبر بودن)، سایت موظف است تا ۴۸ ساعت مشکل را بررسی و در صورت تایید، کد جایگزین ارائه دهد یا وجه را عودت نماید.</li>
                        </ul>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}