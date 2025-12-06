"use client";

import CheckoutModal from "@/components/CheckoutModal";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import {
    ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2, ShieldCheck, Ticket, X, Loader2
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image"; // ✅ اضافه شده برای سئو

export default function CartClient() {
    const { items, removeItem, updateQuantity, total, subtotal, count, discount, applyDiscount, addItem } = useCart();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState("");

    const formatPrice = (value: number) => value.toLocaleString("fa-IR");

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        setCouponError("");

        try {
            const res = await fetch("/api/coupons/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: couponCode, cartTotal: subtotal })
            });
            const data = await res.json();

            if (res.ok) {
                applyDiscount(data);
                setCouponCode("");
            } else {
                setCouponError(data.error);
            }
        } catch (error) {
            setCouponError("خطا در بررسی کد");
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        applyDiscount(null);
        setCouponError("");
    };

    const handlePreOrder = () => {
        if (items.length === 0) {
            addItem({
                id: "perplexity-pro-1year",
                name: "Perplexity Pro Subscription",
                price: 398000
            });
        }
        setIsCheckoutOpen(true);
    };

    return (
        <main className="min-h-screen bg-[#0f172a] text-white pb-20 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
            <Navbar onPreOrder={handlePreOrder} />

            <div className="pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in">
                    <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-3">
                            سبد خرید
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">تکمیل سفارش</h1>
                        <p className="text-gray-400 max-w-2xl leading-relaxed text-sm">
                            محصولات انتخابی خود را مرور کنید. با نهایی کردن سفارش، لایسنس به صورت آنی برای شما صادر می‌شود.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-[#1e293b]/50 border border-white/5 px-4 py-3 rounded-xl backdrop-blur-sm">
                        <ShieldCheck className="text-emerald-400" size={20} />
                        <div className="flex flex-col text-xs text-gray-400">
                            <span className="text-gray-300 font-bold">پرداخت امن و تضمینی</span>
                            <span>رمزگذاری شده با SSL ۲۵۶ بیتی</span>
                        </div>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="bg-[#1e293b]/30 border border-white/5 rounded-3xl p-12 text-center max-w-2xl mx-auto animate-fade-in-up">
                        <ShoppingBag size={48} className="text-gray-600 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-2">سبد خرید خالی است</h2>
                        <Link href="/" className="inline-flex items-center gap-2 mt-6 bg-white/10 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all">
                            <ArrowRight size={20} /> بازگشت به فروشگاه
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4 animate-fade-in-up">
                            <div className="bg-[#1e293b]/40 border border-white/5 rounded-2xl p-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                                        <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-xl border border-white/10 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                                            {/* ✅ استفاده از Image به جای img */}
                                            <Image
                                                src="/perplexity-pro-logo.png"
                                                alt={item.name}
                                                fill
                                                className="object-contain opacity-90 p-2"
                                            />
                                        </div>
                                        <div className="flex-1 text-center sm:text-right w-full">
                                            <h3 className="font-bold text-lg text-white mb-1">{item.name}</h3>
                                            <p className="text-sm text-gray-400 mb-2 sm:mb-0">اکانت پرمیوم ۱ ساله با قابلیت‌های کامل</p>
                                            <div className="sm:hidden font-bold text-cyan-400 text-lg mt-2">{formatPrice(item.price)} ت</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center bg-[#0f172a] rounded-lg border border-white/10 p-1">
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"><Plus size={14} /></button>
                                                <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white" disabled={item.quantity <= 1}><Minus size={14} /></button>
                                            </div>
                                            <div className="hidden sm:block font-bold text-lg text-white min-w-[120px] text-left pl-4">{formatPrice(item.price * item.quantity)} <span className="text-sm text-gray-500 font-normal">ت</span></div>
                                            <button onClick={() => removeItem(item.id)} className="text-red-400 hover:bg-red-500/10 p-2 rounded-xl"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                            <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 sticky top-24 shadow-xl">

                                {/* Coupon Section */}
                                <div className="mb-6">
                                    {!discount ? (
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="کد تخفیف دارید؟"
                                                value={couponCode}
                                                onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                                                className={`w-full bg-[#0f172a] border rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none transition-colors ${couponError ? "border-red-500/50" : "border-white/10 focus:border-cyan-500"}`}
                                            />
                                            <Ticket className="absolute right-3 top-3 text-gray-500" size={18} />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={couponLoading || !couponCode}
                                                className="absolute left-2 top-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                                            >
                                                {couponLoading ? <Loader2 className="animate-spin" size={14} /> : "اعمال"}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Ticket size={16} className="text-emerald-400" />
                                                <span className="text-sm text-emerald-300 font-mono font-bold">{discount.code}</span>
                                            </div>
                                            <button onClick={handleRemoveCoupon} className="text-red-400 hover:bg-red-500/10 p-1 rounded">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                    {couponError && <p className="text-red-400 text-xs mt-2 mr-1">{couponError}</p>}
                                </div>

                                <div className="space-y-3 mb-6 pb-6 border-b border-white/5">
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>قیمت کالاها ({formatPrice(count)})</span>
                                        <span className="text-white font-medium">{formatPrice(subtotal)} تومان</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>تخفیف</span>
                                        <span className={discount ? "text-emerald-400 font-bold" : "text-gray-500"}>
                                            {discount ? `-${formatPrice(subtotal - total)} تومان` : "۰ تومان"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-8">
                                    <span className="font-bold text-lg text-white">جمع نهایی</span>
                                    <div className="text-right">
                                        <span className="block text-2xl font-black text-cyan-400">{formatPrice(total)}</span>
                                        <span className="text-xs text-gray-500">تومان</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsCheckoutOpen(true)}
                                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                                >
                                    ادامه ثبت سفارش <ArrowLeft size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} isCartCheckout={true} />
        </main>
    );
}