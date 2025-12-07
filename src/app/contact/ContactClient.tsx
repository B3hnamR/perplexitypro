"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, Clock, MapPin } from "lucide-react";
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
        <main className="min-h-screen bg-[#0f172a] text-white font-sans flex flex-col">
            <Navbar onPreOrder={handlePreOrder} />
            
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
                                    <h3 className="font-bold text-white mb-1">آدرس</h3>
                                    <p className="text-gray-400 text-sm">فروشگاه اینترنتی (فعالیت آنلاین)</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-cyan-500/10 p-3 rounded-xl text-cyan-400"><Phone size={24} /></div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">تلفن تماس</h3>
                                    <p className="text-gray-400 text-sm dir-ltr text-right font-mono tracking-wider">0936 156 4345</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-cyan-500/10 p-3 rounded-xl text-cyan-400"><Mail size={24} /></div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">پست الکترونیک</h3>
                                    <p className="text-gray-400 text-sm font-mono">info@perplexitypro.ir</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-cyan-500/10 p-3 rounded-xl text-cyan-400"><Clock size={24} /></div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">ساعات پاسخگویی</h3>
                                    <p className="text-gray-400 text-sm">شنبه تا چهارشنبه: ۱۰:۳۰ الی ۱۹:۰۰</p>
                                    <p className="text-gray-400 text-sm">پنج‌شنبه: ۱۰:۳۰ الی ۱۳:۰۰</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}