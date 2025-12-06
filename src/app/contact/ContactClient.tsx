"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function ContactClient() {
    const router = useRouter();
    const { addItem } = useCart();

    const handlePreOrder = () => {
        addItem({
            id: "perplexity-pro-1year",
            name: "Perplexity Pro Subscription",
            price: 398000
        });
        router.push("/cart");
    };

    return (
        // ✅ اضافه شدن flex و flex-col
        <main className="min-h-screen bg-[#0f172a] text-white font-sans flex flex-col">
            <Navbar onPreOrder={handlePreOrder} />

            {/* ✅ اضافه شدن flex-1 برای پر کردن فضای خالی و w-full */}
            <div className="flex-1 w-full pt-32 pb-20 max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-black mb-8 text-center">تماس با ما</h1>

                <div className="bg-[#1e293b] border border-white/5 rounded-3xl p-8 shadow-xl">
                    <p className="text-gray-400 mb-8 text-center leading-relaxed">
                        لطفاً پیش از تماس، بخش سوالات متداول را مطالعه کنید. در صورتی که پاسخ خود را نیافتید، از طریق راه‌های زیر با ما در ارتباط باشید.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-cyan-500/10 p-3 rounded-xl text-cyan-400"><MapPin size={24} /></div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">آدرس پستی</h3>
                                    <p className="text-gray-400 text-sm leading-7">
                                        استان تهران، شهر تهران، خیابان ...، کوچه ...، پلاک ...، واحد ...
                                        <br />
                                        <span className="text-xs opacity-70">کد پستی: 1234567890</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-cyan-500/10 p-3 rounded-xl text-cyan-400"><Phone size={24} /></div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">تلفن تماس</h3>
                                    <p className="text-gray-400 text-sm dir-ltr text-right">021 - 12345678</p>
                                    <p className="text-gray-400 text-sm dir-ltr text-right">0912 - 1234567</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-cyan-500/10 p-3 rounded-xl text-cyan-400"><Mail size={24} /></div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">پست الکترونیک</h3>
                                    <p className="text-gray-400 text-sm">support@perplexitypro.ir</p>
                                    <p className="text-gray-400 text-sm">info@perplexitypro.ir</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-cyan-500/10 p-3 rounded-xl text-cyan-400"><Clock size={24} /></div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">ساعات پاسخگویی</h3>
                                    <p className="text-gray-400 text-sm">شنبه تا چهارشنبه: ۹ صبح الی ۱۷</p>
                                    <p className="text-gray-400 text-sm">پنج‌شنبه: ۹ صبح الی ۱۳</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-xs text-gray-500">
                            صاحب امتیاز: نام و نام خانوادگی شما
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}