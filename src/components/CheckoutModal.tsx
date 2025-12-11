"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, ShieldCheck, Loader2, ArrowLeft, Phone, Lock, AlertCircle } from "lucide-react";
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
    const { data: session } = useSession();
    const { total, clearCart, items } = useCart();
    
    // استیت‌های احراز هویت
    const [authStep, setAuthStep] = useState(1); // 1: Mobile, 2: OTP
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(""); // برای نمایش ارور داخل مودال
    
    // استیت‌های پرداخت
    const [selectedGateway, setSelectedGateway] = useState<"ZARINPAL" | "ZIBAL">("ZARINPAL");

    useEffect(() => {
        if (!isOpen) {
            setAuthStep(1);
            setMobile("");
            setOtp("");
            setError("");
            setLoading(false);
        }
    }, [isOpen]);

    // --- توابع لاگین ---

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (mobile.length !== 11 || !mobile.startsWith("09")) {
            setError("شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود");
            return;
        }

        setLoading(true);
        try {
            // ✅ ارسال به مسیر جدید که تداخل ندارد
            const res = await axios.post("/api/otp/send", { mobile });
            if (res.data.success) {
                setAuthStep(2);
            } else {
                setError("خطا در ارسال پیامک. لطفا مجدد تلاش کنید.");
            }
        } catch (error) {
            setError("خطا در برقراری ارتباط با سرور");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await signIn("credentials", {
            mobile,
            code: otp,
            redirect: false, // جلوگیری از ریدایرکت خودکار
        });

        if (res?.error) {
            setError("کد وارد شده اشتباه یا منقضی شده است");
            setLoading(false);
        } else {
            // موفقیت
            if (mode === "LOGIN_ONLY") {
                window.location.reload();
            }
            setLoading(false);
        }
    };

    // --- توابع پرداخت ---

    const handlePayment = async () => {
        setLoading(true);
        setError("");
        try {
            const orderRes = await axios.post("/api/orders", {
                items: items,
                totalAmount: total,
                gateway: selectedGateway
            });

            const paymentRes = await axios.post("/api/payment/request", {
                orderId: orderRes.data.orderId,
                gateway: selectedGateway
            });

            if (paymentRes.data.url) {
                clearCart();
                window.location.href = paymentRes.data.url;
            }
        } catch (error) {
            console.error(error);
            setError("خطا در ایجاد تراکنش. لطفا مجدد تلاش کنید.");
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-[#0f172a] border border-white/10 p-6 text-right align-middle shadow-xl transition-all relative">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                                    <h3 className="text-xl font-black text-white">
                                        {!session ? "ورود به حساب کاربری" : "انتخاب درگاه پرداخت"}
                                    </h3>
                                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* نمایش خطا بجای Alert */}
                                {error && (
                                    <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-center gap-2 text-sm animate-pulse">
                                        <AlertCircle size={18} />
                                        {error}
                                    </div>
                                )}

                                {/* --- 1. بخش لاگین --- */}
                                {!session ? (
                                    <div>
                                        {authStep === 1 ? (
                                            <form onSubmit={handleSendOtp} className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm text-gray-400">شماره موبایل خود را وارد کنید</label>
                                                    <div className="relative group">
                                                        <input 
                                                            type="tel" 
                                                            value={mobile}
                                                            onChange={(e) => setMobile(e.target.value)}
                                                            className="w-full bg-[#1e293b] border-2 border-white/5 rounded-2xl px-4 py-4 pl-12 text-white text-center text-2xl font-bold tracking-[0.2em] focus:border-cyan-500 focus:outline-none transition-all placeholder:text-gray-600 placeholder:text-lg placeholder:tracking-normal placeholder:font-normal"
                                                            placeholder="0912..."
                                                            maxLength={11}
                                                            autoFocus
                                                        />
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-500 transition-colors" size={24} />
                                                    </div>
                                                </div>
                                                <button 
                                                    type="submit" 
                                                    disabled={loading}
                                                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                                                >
                                                    {loading ? <Loader2 className="animate-spin" /> : "دریافت کد تایید"}
                                                </button>
                                            </form>
                                        ) : (
                                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                                <div className="text-center mb-2">
                                                    <p className="text-sm text-gray-400">کد ارسال شده به <span className="text-white font-bold font-mono mx-1">{mobile}</span> را وارد کنید</p>
                                                </div>
                                                <div className="relative group">
                                                    <input 
                                                        type="text" 
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                        className="w-full bg-[#1e293b] border-2 border-white/5 rounded-2xl px-4 py-4 pl-12 text-white text-center text-3xl font-bold tracking-[0.5em] focus:border-emerald-500 focus:outline-none transition-all placeholder:text-gray-600 placeholder:text-sm placeholder:tracking-normal"
                                                        placeholder="_ _ _ _ _"
                                                        maxLength={5}
                                                        autoFocus
                                                    />
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={24} />
                                                </div>
                                                <div className="flex gap-3">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => { setAuthStep(1); setError(""); }}
                                                        className="px-5 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl transition-colors border border-white/5"
                                                    >
                                                        <ArrowLeft size={24} />
                                                    </button>
                                                    <button 
                                                        type="submit" 
                                                        disabled={loading}
                                                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                                    >
                                                        {loading ? <Loader2 className="animate-spin" /> : "ورود به سیستم"}
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                ) : (
                                    // --- 2. بخش انتخاب درگاه ---
                                    <div className="space-y-6 animate-fade-in">
                                        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex items-center gap-4">
                                            <div className="bg-blue-500 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
                                                <ShieldCheck size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">پرداخت امن و تضمینی</p>
                                                <p className="text-xs text-blue-200/70 mt-1">تراکنش شما توسط شبکه شاپرک پردازش می‌شود</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-gray-400 block mb-2 px-1">درگاه مورد نظر را انتخاب کنید:</label>
                                            
                                            <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedGateway === "ZARINPAL" ? "bg-[#1e293b] border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.15)] scale-[1.02]" : "bg-transparent border-white/5 hover:bg-white/5"}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-black font-black text-sm shadow-lg">ZP</div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-white">زرین‌پال</span>
                                                        <span className="text-[10px] text-gray-400">پرداخت سریع با تمام کارت‌ها</span>
                                                    </div>
                                                </div>
                                                <input type="radio" name="gateway" checked={selectedGateway === "ZARINPAL"} onChange={() => setSelectedGateway("ZARINPAL")} className="w-5 h-5 accent-yellow-500" />
                                            </label>

                                            <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedGateway === "ZIBAL" ? "bg-[#1e293b] border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)] scale-[1.02]" : "bg-transparent border-white/5 hover:bg-white/5"}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg">ZB</div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-white">زیبال</span>
                                                        <span className="text-[10px] text-gray-400">پرداخت‌یار رسمی مرکزی</span>
                                                    </div>
                                                </div>
                                                <input type="radio" name="gateway" checked={selectedGateway === "ZIBAL"} onChange={() => setSelectedGateway("ZIBAL")} className="w-5 h-5 accent-blue-500" />
                                            </label>
                                        </div>

                                        <div className="pt-6 border-t border-white/5">
                                            <div className="flex justify-between items-center mb-6 px-1">
                                                <span className="text-gray-400 text-sm">مبلغ قابل پرداخت:</span>
                                                <div className="text-right">
                                                    <span className="text-2xl font-black text-cyan-400">{total.toLocaleString()}</span>
                                                    <span className="text-xs text-gray-500 mr-1">تومان</span>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                onClick={handlePayment}
                                                disabled={loading}
                                                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
                                            >
                                                {loading ? <Loader2 className="animate-spin" /> : "انتقال به درگاه پرداخت"}
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