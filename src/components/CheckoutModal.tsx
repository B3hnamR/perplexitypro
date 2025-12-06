"use client";

import { useEffect, useState } from "react";
import { X, Lock, ArrowLeft, Smartphone, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { signIn, useSession } from "next-auth/react";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    isCartCheckout?: boolean;
    mode?: "CHECKOUT" | "LOGIN_ONLY";
}

export default function CheckoutModal({ isOpen, onClose, isCartCheckout = false, mode = "CHECKOUT" }: CheckoutModalProps) {
    const { data: session } = useSession();
    const { total, discount } = useCart();
    
    const [step, setStep] = useState(1);
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [userInfo, setUserInfo] = useState({ firstName: "", lastName: "", email: "" });
    const [loading, setLoading] = useState(false);
    const [isNewUser, setIsNewUser] = useState(true);

    useEffect(() => {
        if (isOpen) {
            if (session) {
                if (mode === "CHECKOUT") setStep(4);
                else onClose();
            } else {
                setStep(1);
            }
        }
    }, [isOpen, session, mode]);

    if (!isOpen) return null;

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mobile.length !== 11 || !mobile.startsWith("09")) return alert("شماره موبایل معتبر نیست");
        
        setLoading(true);
        try {
            const res = await fetch("/api/auth/otp/send", {
                method: "POST",
                body: JSON.stringify({ mobile })
            });
            const data = await res.json();

            if (res.ok) {
                setIsNewUser(data.isNewUser);
                setStep(2);
            }
            else alert("خطا در ارسال پیامک");
        } catch (err) { alert("خطا در ارتباط"); }
        finally { setLoading(false); }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        const res = await signIn("credentials", {
            mobile,
            code: otp,
            firstName: isNewUser ? userInfo.firstName : "",
            lastName: isNewUser ? userInfo.lastName : "",
            email: isNewUser ? userInfo.email : "",
            redirect: false,
        });

        setLoading(false);
        if (res?.error) {
            alert("کد وارد شده اشتباه است");
        } else {
            if (mode === "LOGIN_ONLY") onClose();
            else setStep(4);
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/payment/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: isCartCheckout ? total : 398000,
                    // ✅ اصلاح تایپ‌اسکریپت: استفاده از as any برای دسترسی به mobile
                    mobile: (session?.user as any)?.mobile || mobile,
                    description: "خرید اشتراک",
                    couponCode: discount?.code
                }),
            });
            
            const data = await response.json();
            if (data.url) window.location.href = data.url;
            else alert(data.error || "خطا در پرداخت");
        } catch (error) {
            alert("خطا در ارتباط با سرور");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-[#1e293b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                
                <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#0f172a]/50">
                    <h3 className="text-lg font-bold text-white">
                        {step === 4 ? "تکمیل خرید" : "ورود / ثبت‌نام"}
                    </h3>
                    <button onClick={onClose}><X className="text-gray-400" /></button>
                </div>

                <div className="p-6">
                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <p className="text-gray-300 text-sm">برای شروع، شماره موبایل خود را وارد کنید:</p>
                            <div className="relative">
                                <input 
                                    type="tel" value={mobile} onChange={e => setMobile(e.target.value)}
                                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white text-center text-xl tracking-widest placeholder-gray-600 focus:border-cyan-500 focus:outline-none transition-colors dir-ltr"
                                    placeholder="0912..." autoFocus dir="ltr"
                                />
                                <Smartphone className="absolute left-3 top-3.5 text-gray-500" size={20} />
                            </div>
                            <button disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3.5 rounded-xl font-bold transition-all flex justify-center items-center gap-2">
                                {loading ? <Loader2 className="animate-spin" /> : "ارسال کد تایید"}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerify} className="space-y-5">
                            <div className="text-center mb-4">
                                <p className="text-gray-400 text-xs mb-1">کد ارسال شده به {mobile}</p>
                                <button type="button" onClick={() => setStep(1)} className="text-cyan-400 text-xs hover:underline">تغییر شماره</button>
                            </div>
                            
                            <input 
                                type="text" placeholder="- - - - -" value={otp} onChange={e => setOtp(e.target.value)}
                                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-[1em] focus:border-cyan-500 focus:outline-none"
                                maxLength={5} autoFocus
                            />

                            {isNewUser && (
                                <div className="bg-[#0f172a]/50 p-4 rounded-xl border border-white/5 space-y-3 animate-fade-in">
                                    <p className="text-xs text-gray-400 font-bold">تکمیل اطلاعات (اختیاری):</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input placeholder="نام" className="bg-[#1e293b] border border-white/10 rounded-lg p-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                                            onChange={e => setUserInfo({...userInfo, firstName: e.target.value})} />
                                        <input placeholder="نام خانوادگی" className="bg-[#1e293b] border border-white/10 rounded-lg p-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                                            onChange={e => setUserInfo({...userInfo, lastName: e.target.value})} />
                                    </div>
                                    <input type="email" placeholder="ایمیل (اختیاری)" className="w-full bg-[#1e293b] border border-white/10 rounded-lg p-2 text-sm text-white focus:border-cyan-500 focus:outline-none dir-ltr text-left"
                                        onChange={e => setUserInfo({...userInfo, email: e.target.value})} />
                                </div>
                            )}

                            <button disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3.5 rounded-xl font-bold transition-all flex justify-center items-center gap-2">
                                {loading ? <Loader2 className="animate-spin" /> : "تایید و ادامه"}
                            </button>
                        </form>
                    )}

                    {step === 4 && (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                                <Lock size={32} />
                            </div>
                            <div>
                                <p className="text-gray-400 mb-1">مبلغ قابل پرداخت</p>
                                <div className="text-4xl font-black text-white">
                                    {(isCartCheckout ? total : 398000).toLocaleString("fa-IR")} <span className="text-lg text-gray-500">تومان</span>
                                </div>
                                {discount && (
                                    <p className="text-xs text-emerald-400 mt-2">
                                        کد تخفیف <span className="font-mono font-bold">{discount.code}</span> اعمال شد
                                    </p>
                                )}
                            </div>
                            
                            <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl text-xs text-blue-200">
                                پرداخت امن زرین‌پال • تحویل آنی
                            </div>

                            <button onClick={handlePayment} disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/25 transition-all flex justify-center items-center gap-2">
                                {loading ? "در حال انتقال..." : <>پرداخت آنلاین <ArrowLeft size={20} /></>}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}