"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Package, 
    LogOut, 
    Link as LinkIcon, 
    Brain, 
    Users, 
    Ticket,
    Settings,
    FileText // ✅ اضافه شده برای آیکون وبلاگ
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
    { href: "/admin/dashboard", label: "داشبورد", icon: LayoutDashboard },
    { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingBag },
    { href: "/admin/users", label: "کاربران", icon: Users },
    { href: "/admin/product", label: "محصول", icon: Package },
    { href: "/admin/links", label: "انبار لینک‌ها", icon: LinkIcon },
    { href: "/admin/blog", label: "وبلاگ", icon: FileText }, // ✅ لینک جدید وبلاگ
    { href: "/admin/coupons", label: "کدهای تخفیف", icon: Ticket },
    { href: "/admin/settings", label: "تنظیمات سایت", icon: Settings },
];

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full bg-[#1e293b] border-r border-white/5">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                        <Brain size={20} />
                    </div>
                    <span className="font-bold text-lg tracking-wide text-white">
                        Perplexity<span className="text-cyan-400">Pro</span>
                    </span>
                </div>
                {/* دکمه بستن فقط در موبایل نمایش داده می‌شود */}
                {onClose && (
                    <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white transition-colors">
                        ✕
                    </button>
                )}
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    // شرط فعال بودن: اگر آدرس دقیقاً برابر بود یا با آن شروع می‌شد (برای زیرمنوها)
                    // استثنا: داشبورد فقط باید دقیق باشد تا با بقیه قاطی نشود
                    const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                isActive 
                                    ? "bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20 shadow-sm" 
                                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                            }`}
                        >
                            <item.icon 
                                size={20} 
                                className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} 
                            />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5 bg-[#1e293b]">
                <button
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 font-medium group border border-transparent hover:border-red-500/20"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>خروج از حساب</span>
                </button>
            </div>
        </div>
    );
}