"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, ShieldCheck, CreditCard, Wallet, Loader2, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: "LOGIN_ONLY" | "CHECKOUT";
    isCartCheckout?: boolean;
}

export default function CheckoutModal({ isOpen, onClose, mode = "CHECKOUT", isCartCheckout = false }: CheckoutModalProps) {
    const { data: session } = useSession();
    const { total, clearCart, items } = useCart();
    const router = useRouter();
    
    const [step, setStep] = useState(1); // 1: Login/Phone, 2: Gateway Select
    const [mobile, setMobile] = useState("");
    const [loading, setLoading] = useState(false);
    
    // ✅ استیت انتخاب درگاه (پیش‌فرض زرین‌پال)
    const [selectedGateway, setSelectedGateway] = useState<"ZARINPAL" | "ZIBAL">("ZARINPAL");

    // --- لاجیک‌های لاگین (بدون تغییر) ---
    const handleSendOtp = async (e: React.FormEvent) => { /* ... کدهای قبلی لاگین ... */ };
    const handleVerifyOtp = async (e: React.FormEvent) => { /* ... کدهای قبلی تایید ... */ };

    // ✅ فانکشن پرداخت جدید
    const handlePayment = async () => {
        setLoading(true);
        try {
            // 1. ثبت سفارش اولیه در دیتابیس
            const orderRes = await axios.post("/api/orders", {
                items: items,
                totalAmount: total,
                gateway: selectedGateway // ذخیره درگاه انتخابی (اختیاری در اوردر)
            });

            const orderId = orderRes.data.orderId;

            // 2. درخواست پرداخت
            const paymentRes = await axios.post("/api/payment/request", {
                orderId: orderId,
                gateway: selectedGateway
            });

            if (paymentRes.data.url) {
                // اگر موفق بود، سبد خرید را خالی کن و برو به درگاه
                clearCart();
                window.location.href = paymentRes.data.url;
            }

        } catch (error) {
            console.error(error);
            alert("خطا در ایجاد سفارش");
            setLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-[#0f172a] border border-white/10 p-6 text-right align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-white">
                                        {mode === "LOGIN_ONLY" ? "ورود به حساب" : "انتخاب روش پرداخت"}
                                    </h3>
                                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* اگر کاربر لاگین نیست، فرم لاگین را نشان بده (کد قبلی) */}
                                {!session ? (
                                    <div className="space-y-4">
                                        {/* ... (کدهای فرم لاگین که قبلاً داشتید) ... */}
                                        {/* برای خلاصه شدن اینجا تکرار نکردم، همان کدهای قبلی را بگذارید */}
                                        <p className="text-center text-gray-500">لطفا ابتدا وارد شوید</p>
                                        <button onClick={() => signIn()} className="w-full bg-cyan-600 py-3 rounded-xl font-bold text-white">ورود سریع</button>
                                    </div>
                                ) : (
                                    // اگر کاربر لاگین است، انتخاب درگاه را نشان بده
                                    <div className="space-y-6">
                                        <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-2xl flex items-center gap-3">
                                            <ShieldCheck className="text-cyan-400" size={24} />
                                            <div>
                                                <p className="font-bold text-white text-sm">پرداخت امن زرین‌پال / زیبال</p>
                                                <p className="text-xs text-gray-400 mt-1">تضمین امنیت تراکنش توسط شاپرک</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm text-gray-400 block mb-2">درگاه پرداخت را انتخاب کنید:</label>
                                            
                                            {/* Zarinpal Option */}
                                            <label 
                                                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                                                    selectedGateway === "ZARINPAL" 
                                                    ? "bg-[#1e293b] border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]" 
                                                    : "bg-transparent border-white/10 hover:bg-white/5"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-black text-xs">
                                                        ZP
                                                    </div>
                                                    <span className="font-bold text-white">زرین‌پال</span>
                                                </div>
                                                <input 
                                                    type="radio" 
                                                    name="gateway" 
                                                    checked={selectedGateway === "ZARINPAL"}
                                                    onChange={() => setSelectedGateway("ZARINPAL")}
                                                    className="w-5 h-5 accent-yellow-500"
                                                />
                                            </label>

                                            {/* Zibal Option */}
                                            <label 
                                                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                                                    selectedGateway === "ZIBAL" 
                                                    ? "bg-[#1e293b] border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                                                    : "bg-transparent border-white/10 hover:bg-white/5"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xs">
                                                        ZB
                                                    </div>
                                                    <span className="font-bold text-white">زیبال</span>
                                                </div>
                                                <input 
                                                    type="radio" 
                                                    name="gateway" 
                                                    checked={selectedGateway === "ZIBAL"}
                                                    onChange={() => setSelectedGateway("ZIBAL")}
                                                    className="w-5 h-5 accent-blue-500"
                                                />
                                            </label>
                                        </div>

                                        <div className="pt-4 border-t border-white/5">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-gray-400">مبلغ قابل پرداخت:</span>
                                                <span className="text-xl font-black text-cyan-400">{total.toLocaleString()} تومان</span>
                                            </div>
                                            
                                            <button 
                                                onClick={handlePayment}
                                                disabled={loading}
                                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                            >
                                                {loading ? <Loader2 className="animate-spin" /> : <>پرداخت و تکمیل خرید <ArrowLeft size={20}/></>}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}