import { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
    title: "حریم خصوصی | Perplexity Pro",
    robots: { index: true, follow: true }
};

export default function PrivacyPage() {
    return <PrivacyClient />;
}