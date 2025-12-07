"use client";

import NotificationSystem from "@/components/NotificationSystem";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function HeaderWrapper() {
    const pathname = usePathname();

    // اگر در ادمین یا لاگین هستیم، هیچکدام را نشان نده
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) {
        return null;
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            {/* بنر و نوار ناوبری اینجا کنار هم هستند */}
            <NotificationSystem />
            <Navbar isWrapperMode={true} />
        </header>
    );
}