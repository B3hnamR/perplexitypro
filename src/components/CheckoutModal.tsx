"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, ShieldCheck, Loader2, ArrowLeft, Phone, Lock, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: "LOGIN_ONLY" | "CHECKOUT";
    isCartCheckout?: boolean;
}

export default function CheckoutModal({ isOpen, onClose, mode = "CHECKOUT", isCartCheckout = false }: CheckoutModalProps) {
    const { data: session, status } = useSession();
    const { total, clearCart, items } = useCart();
    
    // استیت‌های احراز هویت
    const [authStep, setAuthStep] = useState(1); // 1: Mobile, 2: OTP
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    
    // استیت‌های پرداخت
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState<"ZARINPAL" | "ZIBAL">("ZARINPAL");

    // ریست کردن استیت وقتی مودال بسته میشه
    useEffect(() => {
        if (!isOpen) {
            setAuthStep(1);
            setMobile("");
            setOtp("");
        }
    }, [isOpen]);

    // --- توابع لاگین ---

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mobile.length !== 11 || !mobile.startsWith("09")) {
            alert("شماره موبایل معتبر نیست");
            return;
        }

        setOtpLoading(true);
        try {
            const res = await axios.post("/api/auth/send-otp", { mobile });
            if (res.data.success) {
                setAuthStep(2);
            } else {
                alert("خطا در ارسال پیامک");
            }
        } catch (error) {
            alert("خطا در برقراری ارتباط");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setOtpLoading(true);

        const res = await signIn("credentials", {
            mobile,
            code: otp,
            redirect: false, // ⚠️ مهم: جلوگیری از ریدایرکت به صفحه لاگین
        });

        if (res?.error) {
            alert("کد وارد شده اشتباه است");
            setOtpLoading(false);
        } else {
            // لاگین موفق
            if (mode === "LOGIN_ONLY") {
                onClose();
                window.location.reload(); // رفرش برای اعمال تغییرات هدر
            }
            // اگر مود پرداخت باشد، خودکار سوییچ میشه به فرم پرداخت چون session میاد
            setOtpLoading(false);
        }
    };

    // --- توابع پرداخت ---

    const handlePayment = async () => {
        setPaymentLoading(true);
        try {
            // 1. ثبت سفارش
            const orderRes = await axios.post("/api/orders", {
                items: items,
                totalAmount: total,
                gateway: selectedGateway
            });

            const orderId = orderRes.data.orderId;

            // 2. درخواست درگاه
            const paymentRes = await axios.post("/api/payment/request", {
                orderId: orderId,
                gateway: selectedGateway
            });

            if (paymentRes.data.url) {
                clearCart();
                window.location.href = paymentRes.data.url;
            }

        } catch (error) {
            console.error(error);
            alert("خطا در ایجاد سفارش");
            setPaymentLoading(false);
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
                                        {!session ? "ورود / عضویت" : "تکمیل خرید"}
                                    </h3>
                                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* ─── بخش لاگین (اگر کاربر مهمان است) ─── */}
                                {!session ? (
                                    <div>
                                        {authStep === 1 ? (
                                            <form onSubmit={handleSendOtp} className="space-y-4">
                                                <p className="text-sm text-gray-400 mb-4">
                                                    برای ادامه خرید یا ورود به حساب، شماره موبایل خود را وارد کنید.
                                                </p>
                                                <div className="relative">
                                                    <input 
                                                        type="tel" 
                                                        value={mobile}
                                                        onChange={(e) => setMobile(e.target.value)}
                                                        className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white text-center text-lg tracking-widest focus:border-cyan-500 focus:outline-none"
                                                        placeholder="09123456789"
                                                        maxLength={11}
                                                        autoFocus
                                                    />
                                                    <Phone className="absolute left-3 top-3.5 text-gray-500" size={20} />
                                                </div>
                                                <button 
                                                    type="submit" 
                                                    disabled={otpLoading}
                                                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all disabled:opacity-50"
                                                >
                                                    {otpLoading ? <Loader2 className="animate-spin" /> : "ارسال کد تایید"}
                                                </button>
                                            </form>
                                        ) : (
                                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                                <div className="bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-xl text-center mb-4">
                                                    <p className="text-xs text-cyan-300 mb-1">کد ارسال شده به شماره:</p>
                                                    <p className="font-bold text-white tracking-wider">{mobile}</p>
                                                </div>
                                                <div className="relative">
                                                    <input 
                                                        type="text" 
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white text-center text-2xl tracking-[0.5em] focus:border-emerald-500 focus:outline-none"
                                                        placeholder="_____"
                                                        maxLength={5}
                                                        autoFocus
                                                    />
                                                    <Lock className="absolute left-3 top-3.5 text-gray-500" size={20} />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setAuthStep(1)}
                                                        className="px-4 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl transition-colors"
                                                    >
                                                        <ArrowLeft size={20} />
                                                    </button>
                                                    <button 
                                                        type="submit" 
                                                        disabled={otpLoading}
                                                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all disabled:opacity-50"
                                                    >
                                                        {otpLoading ? <Loader2 className="animate-spin" /> : "تایید و ورود"}
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                ) : (
                                    // ─── بخش پرداخت (اگر کاربر لاگین است) ───
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
                                                disabled={paymentLoading}
                                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                            >
                                                {paymentLoading ? <Loader2 className="animate-spin" /> : <>پرداخت و تکمیل خرید <ArrowLeft size={20}/></>}
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