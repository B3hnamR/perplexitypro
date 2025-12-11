"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Brain, User, LogOut, ChevronDown, LayoutDashboard, ShoppingCart, ListOrdered, Phone, Loader2, BookOpen } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import CheckoutModal from "./CheckoutModal";
import axios from "axios"; // ✅ اضافه شد

interface NavbarProps {
    isWrapperMode?: boolean;
}

export default function Navbar({ isWrapperMode = false }: NavbarProps) {
    const { data: session } = useSession();
    const { count, addItem } = useCart();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [buyingLoading, setBuyingLoading] = useState(false); // ✅ لودینگ برای دکمه خرید
    
    const dropdownRef = useRef<HTMLDivElement>(null);

    // ✅ تابع جدید: دریافت قیمت واقعی و افزودن به سبد خرید
    const handleBuySubscription = async () => {
        setBuyingLoading(true);
        try {
            // 1. دریافت قیمت لحظه‌ای از سرور
            const res = await axios.get("/api/product/main");
            const product = res.data;

            if (product) {
                // 2. افزودن به سبد خرید با قیمت درست
                addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price
                });
                
                // 3. هدایت به سبد خرید
                router.push("/cart");
                setIsUserMenuOpen(false);
            }
        } catch (error) {
            alert("خطا در دریافت اطلاعات محصول. لطفا صفحه را رفرش کنید.");
        } finally {
            setBuyingLoading(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navContainerClass = isWrapperMode 
        ? `w-full transition-all duration-300 ${scrolled ? 'bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 shadow-lg' : 'bg-transparent'}`
        : `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 shadow-lg' : 'bg-transparent'}`;

    return (
        <>
            <nav className={navContainerClass}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
                            <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20 transition-transform group-hover:scale-105">
                                <Brain size={22} />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-wide">
                                Perplexity<span className="text-cyan-400">Pro</span>
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <Link href="/#features" className="text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all">ویژگی‌ها</Link>
                            <Link href="/#pricing" className="text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all">قیمت‌ها</Link>
                            {/* ✅ لینک وبلاگ اضافه شد */}
                            <Link href="/blog" className="text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all">وبلاگ</Link>
                            <Link href="/track" className="text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all">پیگیری سفارش</Link>
                            <Link href="/contact" className="text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all flex items-center gap-2">
                                <Phone size={14} className="text-cyan-400" /> تماس با ما
                            </Link>
                        </div>

                        {/* Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            <Link href="/cart" className="text-gray-300 hover:text-white transition-colors relative p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5">
                                <ShoppingCart size={20} />
                                {count > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0f172a] shadow-lg">
                                        {count}
                                    </span>
                                )}
                            </Link>

                            {session ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button 
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white pl-3 pr-2 py-2 rounded-xl font-medium transition-all"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-sm font-bold shadow-md">
                                            {session.user?.name?.[0] || "U"}
                                        </div>
                                        <span className="text-sm px-1">{session.user?.name || "کاربر"}</span>
                                        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isUserMenuOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isUserMenuOpen && (
                                        <div className="absolute left-0 mt-3 w-64 bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up origin-top-left z-50 p-1.5">
                                            {(session.user as any).role === "ADMIN" && (
                                                <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
                                                    <LayoutDashboard size={18} className="text-cyan-400"/>
                                                    پنل مدیریت
                                                </Link>
                                            )}

                                            <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
                                                <ListOrdered size={18} className="text-blue-400"/>
                                                سفارش‌های من
                                            </Link>

                                            {(session.user as any).role !== "ADMIN" && (
                                                 // ✅ دکمه خرید هوشمند جایگزین شد
                                                 <button 
                                                    onClick={handleBuySubscription} 
                                                    disabled={buyingLoading}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-xl transition-colors text-right"
                                                >
                                                    {buyingLoading ? <Loader2 className="animate-spin text-purple-400" size={18}/> : <User size={18} className="text-purple-400"/>}
                                                    خرید اشتراک جدید
                                                </button>
                                            )}
                                            <div className="h-px bg-white/5 my-1 mx-2"></div>
                                            <button 
                                                onClick={() => signOut()}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-right"
                                            >
                                                <LogOut size={18} />
                                                خروج از حساب
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setIsLoginModalOpen(true)} 
                                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105 active:scale-95"
                                >
                                    <User size={18} />
                                    ورود / عضویت
                                </button>
                            )}
                        </div>

                        {/* Mobile Toggle */}
                        <div className="md:hidden flex items-center gap-3">
                            <Link href="/cart" className="text-gray-300 hover:text-white relative p-2">
                                <ShoppingCart size={24} />
                                {count > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {count}
                                    </span>
                                )}
                            </Link>
                            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white p-2">
                                {isOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Content */}
                {isOpen && (
                    <div className="md:hidden bg-[#0f172a] border-b border-white/10 px-4 pt-2 pb-6 space-y-2 animate-fade-in shadow-2xl">
                        <Link href="/#features" className="block text-gray-300 py-3 px-4 rounded-xl hover:bg-white/5 hover:text-cyan-400 transition-colors" onClick={() => setIsOpen(false)}>ویژگی‌ها</Link>
                        <Link href="/#pricing" className="block text-gray-300 py-3 px-4 rounded-xl hover:bg-white/5 hover:text-cyan-400 transition-colors" onClick={() => setIsOpen(false)}>قیمت‌ها</Link>
                        {/* ✅ لینک وبلاگ موبایل */}
                        <Link href="/blog" className="block text-gray-300 py-3 px-4 rounded-xl hover:bg-white/5 hover:text-cyan-400 transition-colors" onClick={() => setIsOpen(false)}>وبلاگ</Link>
                        <Link href="/track" className="block text-gray-300 py-3 px-4 rounded-xl hover:bg-white/5 hover:text-cyan-400 transition-colors" onClick={() => setIsOpen(false)}>پیگیری سفارش</Link>
                        <Link href="/contact" className="block text-gray-300 py-3 px-4 rounded-xl hover:bg-white/5 hover:text-cyan-400 transition-colors" onClick={() => setIsOpen(false)}>تماس با ما</Link>
                        
                        {!session && (
                            <div className="pt-4 border-t border-white/5 mt-2">
                                <button 
                                    onClick={() => { setIsLoginModalOpen(true); setIsOpen(false); }}
                                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg"
                                >
                                    ورود / عضویت
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </nav>
            
            <CheckoutModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} mode="LOGIN_ONLY" />
        </>
    );
}