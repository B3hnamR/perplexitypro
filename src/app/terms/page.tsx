import { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
    title: "قوانین و مقررات | Perplexity Pro",
    description: "شرایط استفاده از خدمات و قوانین خرید",
    robots: { index: true, follow: true }
};

export default function TermsPage() {
    return <TermsClient />;
}