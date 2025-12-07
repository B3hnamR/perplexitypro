"use client";

import { useState, useEffect } from "react";
import { X, Megaphone, Tag, ArrowLeft, Bell, Gift, Zap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotificationSystem() {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [visibleID, setVisibleID] = useState<string | null>(null);
    const [showBanner, setShowBanner] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return;

        fetch("/api/public/announcements")
            .then(res => res.json())
            .then(data => {
                const closedList = JSON.parse(localStorage.getItem("closedAnnouncements") || "[]");
                const validAnnouncements = data.filter((a: any) => a.isActive && !closedList.includes(a.id));
                setAnnouncements(validAnnouncements);

                const modal = validAnnouncements.find((a: any) => a.type.startsWith("MODAL"));
                if (modal) setVisibleID(modal.id);
            })
            .catch(err => console.error(err));
    }, [pathname]);

    if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

    const handleClose = (id: string, isBanner = false) => {
        const closedList = JSON.parse(localStorage.getItem("closedAnnouncements") || "[]");
        localStorage.setItem("closedAnnouncements", JSON.stringify([...closedList, id]));

        if (isBanner) {
            setShowBanner(false);
        } else {
            setVisibleID(null);
        }
    };

    const banner = announcements.find(a => a.type === "BANNER");
    const modal = announcements.find(a => a.id === visibleID);

    return (
        <>
            {/* --- TOP BANNER (حالت Relative برای هماهنگی با منو) --- */}
            <AnimatePresence>
                {banner && showBanner && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="relative z-[60] bg-[#0f172a] border-b border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                    >
                        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                            <div className="flex-1 flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-white">
                                <span className="flex h-2 w-2 relative flex-shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                </span>
                                <span className="truncate max-w-[80vw] text-center">{banner.message}</span>
                                {banner.link && (
                                    <Link href={banner.link} className="bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-white px-3 py-0.5 rounded-full text-[10px] md:text-xs transition-all flex items-center gap-1 whitespace-nowrap">
                                        {banner.linkText || "دیدن"} <ArrowLeft size={10} />
                                    </Link>
                                )}
                            </div>
                            <button 
                                onClick={() => handleClose(banner.id, true)}
                                className="text-gray-400 hover:text-white transition-colors p-1"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MODAL POPUPS --- */}
            <AnimatePresence>
                {modal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => handleClose(modal.id)}
                        />
                        
                        <motion.div 
                            initial={{ scale: 0.5, opacity: 0, rotateX: 90 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            exit={{ scale: 0.5, opacity: 0, rotateX: -90 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="relative w-full max-w-sm"
                        >
                            {/* استایل تخفیف */}
                            {modal.type === "MODAL_DISCOUNT" ? (
                                <div className="bg-[#1e1b4b] border-2 border-indigo-500/50 rounded-[32px] p-1 shadow-[0_0_50px_rgba(99,102,241,0.4)] overflow-hidden relative">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500 blur-[80px] rounded-full opacity-50"></div>
                                    <div className="bg-[#0f172a] rounded-[28px] p-6 text-center relative z-10">
                                        <button onClick={() => handleClose(modal.id)} className="absolute top-3 right-3 w-8 h-8 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all">
                                            <X size={16} />
                                        </button>
                                        <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 transform -rotate-6">
                                            <Gift size={40} className="text-white animate-pulse" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{modal.title}</h3>
                                        <p className="text-indigo-200 text-sm mb-6 leading-relaxed">{modal.message}</p>
                                        {modal.link && (
                                            <Link href={modal.link} onClick={() => handleClose(modal.id)} className="block w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.02] active:scale-95">
                                                {modal.linkText || "دریافت تخفیف"}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* استایل اخبار */
                                <div className="bg-[#0f172a] border border-cyan-500/30 rounded-[32px] p-8 text-center shadow-[0_0_40px_rgba(6,182,212,0.2)] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                                    <button onClick={() => handleClose(modal.id)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                    <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-5 border border-cyan-500/20">
                                        <Bell size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{modal.title}</h3>
                                    <p className="text-gray-400 text-sm mb-6 leading-7">{modal.message}</p>
                                    {modal.link && (
                                        <Link href={modal.link} onClick={() => handleClose(modal.id)} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-[#0f172a] bg-cyan-400 hover:bg-cyan-300 transition-all">
                                            <Zap size={18} fill="currentColor"/> {modal.linkText || "اطلاعات بیشتر"}
                                        </Link>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}