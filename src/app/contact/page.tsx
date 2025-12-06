import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
    title: "تماس با ما | Perplexity Pro",
    description: "راه‌های ارتباطی با پشتیبانی پرپلکسیتی پرو",
    robots: { index: true, follow: true }
};

export default function ContactPage() {
    return <ContactClient />;
}