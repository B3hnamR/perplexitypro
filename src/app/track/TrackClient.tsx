"use client";

import { useState } from "react";
import { Search, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import DeliveryClient from "../delivery/[token]/DeliveryClient";

export default function TrackClient() {
    const [step, setStep] = useState(1);
    const [trackingCode, setTrackingCode] = useState("");
    const [mobileMasked, setMobileMasked] = useState("");
    const [otp, setOtp] = useState("");
    const [orderData, setOrderData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/orders/track/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trackingCode })
            });
            const data = await res.json();

            if (res.ok) {
                setMobileMasked(data.mobile);
                setStep(2);
            } else {
                setError(data.error || "سفارش یافت نشد");
            }
        } catch (err) { setError("خطا در ارتباط"); }
        finally { setLoading(false); }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/orders/track/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trackingCode, otp })
            });
            const data = await res.json();

            if (res.ok) {
                setOrderData(data);
                setStep(3);
            } else {
                setError(data.error || "کد تایید اشتباه است");
            }
        } catch (err) { setError("خطا در ارتباط"); }
        finally { setLoading(false); }
    };

    return (
        <main className="min-h-screen bg-[#0f172a] font-sans text-white">
            <Navbar onPreOrder={() => { }} />

            <div className="pt-32 pb-20 max-w-xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black mb-4">پیگیری امن سفارش</h1>
                    <p className="text-gray-400">برای مشاهده جزئیات و دریافت لینک‌ها، کد پیگیری را وارد کنید.</p>
                </div>

                <div className="bg-[#1e293b] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    {step === 1 && (
                        <form onSubmit={handleRequestOtp} className="space-y-6">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="کد پیگیری (مثلاً ORD-123456)"
                                    value={trackingCode}
                                    onChange={(e) => setTrackingCode(e.target.value)}
                                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 pl-12 text-white text-center text-lg tracking-wider focus:border-cyan-500 focus:outline-none transition-colors uppercase placeholder-gray-600"
                                    required
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-500 transition-colors" size={20} />
                            </div>
                            <button disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all">
                                {loading ? <Loader2 className="animate-spin" /> : "ادامه و تایید هویت"}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in">
                            <div className="text-center bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                                <p className="text-sm text-cyan-300 mb-2">کد تایید به شماره زیر ارسال شد:</p>
                                <p className="text-xl font-bold font-mono text-white" dir="ltr">{mobileMasked}</p>
                            </div>

                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="کد ۵ رقمی"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 pl-12 text-white text-center text-2xl tracking-[0.5em] focus:border-cyan-500 focus:outline-none transition-colors"
                                    maxLength={5}
                                    required
                                    autoFocus
                                />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-500 transition-colors" size={20} />
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setStep(1)} className="px-4 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400">
                                    <ArrowRight />
                                </button>
                                <button disabled={loading} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all">
                                    {loading ? <Loader2 className="animate-spin" /> : "مشاهده سفارش"}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 3 && orderData && (
                        <div className="animate-fade-in space-y-6">
                            <div className="bg-[#0f172a] p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                <span className="text-gray-400">وضعیت:</span>
                                <span className="text-emerald-400 font-bold">پرداخت شده</span>
                            </div>

                            {orderData.links && orderData.links.length > 0 ? (
                                <DeliveryClient links={orderData.links} />
                            ) : (
                                <div className="text-center text-yellow-400 p-6 bg-yellow-500/10 rounded-xl border border-yellow-500/20 flex flex-col items-center gap-3">
                                    <AlertCircle className="animate-pulse" size={32} />
                                    <p className="font-bold text-lg">لینک فعال‌سازی هنوز صادر نشده است.</p>
                                    <p className="text-sm opacity-80 leading-relaxed">
                                        لطفاً دقایقی دیگر تلاش کنید. همکاران ما به زودی لینک را برای شما ارسال خواهند کرد.
                                    </p>
                                </div>
                            )}

                            <button onClick={() => window.location.reload()} className="w-full mt-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400 transition-colors text-sm">
                                جستجوی مجدد
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center animate-pulse">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}