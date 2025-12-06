import { Metadata } from "next";
import ProfileClient from "./ProfileClient"; // ⚠️ فایل جدید را بسازید

export const metadata: Metadata = {
    title: "حساب کاربری | Perplexity Pro",
    description: "مدیریت سفارش‌ها و مشاهده تاریخچه خریدها.",
    robots: {
        index: false, // ⚠️ پروفایل شخصی نباید ایندکس شود
        follow: false,
    }
};

export default function ProfilePage() {
    return <ProfileClient />;
}