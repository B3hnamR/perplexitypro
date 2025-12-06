import { Metadata } from "next";
import TrackClient from "./TrackClient"; // ⚠️ فایل جدید را بسازید

export const metadata: Metadata = {
    title: "پیگیری سفارش | Perplexity Pro",
    description: "وضعیت سفارش خود را پیگیری کنید و لایسنس خود را دریافت نمایید.",
};

export default function TrackPage() {
    return <TrackClient />;
}