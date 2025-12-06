import { Metadata } from "next";
import CartClient from "./CartClient"; // ⚠️ مطمئن شوید که CartClient.tsx را ساخته‌اید

export const metadata: Metadata = {
    title: "سبد خرید | Perplexity Pro",
    description: "مشاهده و نهایی‌سازی سفارش خرید اشتراک پرپلکسیتی پرو.",
    robots: {
        index: false, // ⚠️ سبد خرید نباید ایندکس شود
        follow: false,
    }
};

export default function CartPage() {
    return <CartClient />;
}