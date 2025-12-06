"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Box, 
    Link as LinkIcon, 
    Settings, 
    LogOut,
    X,
    Brain
} from "lucide-react";

const menuItems = [
    { name: "داشبورد", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "سفارش‌ها", href: "/admin/orders", icon: ShoppingBag },
    { name: "مدیریت محصول", href: "/admin/product", icon: Box },
    { name: "انبار (لینک‌ها)", href: "/admin/links", icon: LinkIcon },
    { name: "تنظیمات (فیلدها)", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-white">
                        <Brain size={20} />
                    </div>
                    <span className="font-bold text-lg tracking-wide">Perplexity<span className="text-cyan-400">Pro</span></span>
                </div>
                <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
                    <X size={24} />
                </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                isActive 
                                    ? "bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20" 
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                >
                    <LogOut size={20} />
                    <span>خروج از حساب</span>
                </button>
            </div>
        </div>
    );
}