"use client";

import { useState, useEffect } from "react";
import { X, Gift, Copy, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function ExitPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [copied, setCopied] = useState(false);
    
    // کد تخفیفی که باید در پنل ادمین بسازید
    const COUPON_CODE = "STAY5"; 

    useEffect(() => {
        // چک کنیم قبلاً بسته نشده باشد (برای اینکه مزاحم نشود)
        const isClosed = localStorage.getItem("exit_popup_seen");
        if (isClosed) return;

        const handleMouseLeave = (e: MouseEvent) => {
            // اگر موس از بالای صفحه خارج شد (سمت تب‌ها)
            if (e.clientY <= 0) {
                setIsVisible(true);
            }
        };

        document.addEventListener("mouseleave", handleMouseLeave);
        return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // ذخیره در حافظه که تا ۲۴ ساعت آینده نشان ندهد
        localStorage.setItem("exit_popup_seen", "true");
        // (پیشرفته‌تر: می‌توانید با expire time ست کنید، فعلا ساده می‌گذاریم)
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(COUPON_CODE);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0, y: 100 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: 100 }}
                        className="relative w-full max-w-lg bg-[#0f172a] rounded-3xl border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden"
                    >
                        {/* Header Image/Gradient */}
                        <div className="h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 shadow-xl transform rotate-12">
                                <Gift size={40} className="text-white animate-bounce" />
                            </div>
                            <button 
                                onClick={handleClose}
                                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 text-center">
                            <h2 className="text-3xl font-black text-white mb-2">صبر کن! دست خالی نرو 🎁</h2>
                            <p className="text-gray-300 mb-8 leading-relaxed">
                                هنوز تردید داری؟ برای اینکه قدرت هوش مصنوعی رو تجربه کنی، 
                                <br/>
                                <span className="text-purple-400 font-bold">۵٪ تخفیف ویژه</span> روی اولین خریدت بگیر.
                            </p>

                            {/* Coupon Box */}
                            <div className="flex items-center gap-2 bg-[#1e293b] border border-dashed border-purple-500/50 p-2 rounded-2xl mb-6">
                                <div className="flex-1 text-center font-mono text-xl font-bold text-white tracking-widest pl-4">
                                    {COUPON_CODE}
                                </div>
                                <button 
                                    onClick={handleCopy}
                                    className={`px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                                        copied 
                                        ? "bg-emerald-500 text-white" 
                                        : "bg-purple-600 hover:bg-purple-500 text-white"
                                    }`}
                                >
                                    {copied ? <><Check size={16}/> کپی شد</> : <><Copy size={16}/> کپی کد</>}
                                </button>
                            </div>

                            <button 
                                onClick={handleClose}
                                className="text-gray-500 hover:text-white text-sm transition-colors border-b border-transparent hover:border-white"
                            >
                                نه ممنون، تخفیف نمی‌خوام
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}