"use client";

import { useState, useEffect } from "react";
import { X, Megaphone, Tag, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export default function NotificationSystem() {
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(true);

    useEffect(() => {
        // دریافت اعلانات فعال
        fetch("/api/public/announcements") // ما یک روت پابلیک برای این میسازیم
            .then(res => res.json())
            .then(data => setAnnouncements(data))
            .catch(err => console.error(err));
    }, []);

    const banner = announcements.find(a => a.type === "BANNER" && a.isActive);
    const modal = announcements.find(a => a.type.startsWith("MODAL") && a.isActive);

    return (
        <>
            {/* --- TOP BANNER --- */}
            <AnimatePresence>
                {banner && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white relative z-[60]"
                    >
                        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-sm md:text-base font-medium">
                            <div className="flex items-center gap-3 w-full justify-center text-center">
                                <span className="bg-white/20 px-2 py-0.5 rounded text-xs hidden md:inline-block">ویژه</span>
                                <p>{banner.message}</p>
                                {banner.link && (
                                    <Link href={banner.link} className="underline decoration-white/50 underline-offset-4 hover:decoration-white transition-all flex items-center gap-1">
                                        {banner.linkText || "کلیک کنید"} <ArrowLeft size={14} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- MODAL POPUP --- */}
            <AnimatePresence>
                {modal && showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowModal(false)}
                        />
                        
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className={`relative w-full max-w-md rounded-3xl p-1 shadow-2xl overflow-hidden ${
                                modal.type === "MODAL_DISCOUNT" 
                                ? "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500" 
                                : "bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600"
                            }`}
                        >
                            <div className="bg-[#0f172a] rounded-[22px] p-8 text-center relative h-full">
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>

                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg ${
                                    modal.type === "MODAL_DISCOUNT" ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400"
                                }`}>
                                    {modal.type === "MODAL_DISCOUNT" ? <Tag size={32} /> : <Megaphone size={32} />}
                                </div>

                                <h3 className="text-2xl font-black text-white mb-3">{modal.title}</h3>
                                <p className="text-gray-300 mb-8 leading-relaxed">
                                    {modal.message}
                                </p>

                                {modal.link && (
                                    <Link 
                                        href={modal.link}
                                        onClick={() => setShowModal(false)}
                                        className={`block w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02] ${
                                            modal.type === "MODAL_DISCOUNT" 
                                            ? "bg-gradient-to-r from-orange-500 to-red-600 shadow-orange-500/25" 
                                            : "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/25"
                                        }`}
                                    >
                                        {modal.linkText || "ادامه"}
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}