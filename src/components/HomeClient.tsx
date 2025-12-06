"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SmartSearchDemo from "@/components/SmartSearchDemo";
import ComparisonSection from "@/components/ComparisonSection";
import FullSpecsSection from "@/components/FullSpecsSection";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

interface HomeClientProps {
    product: any;
}

export default function HomeClient({ product }: HomeClientProps) {
    const { addItem } = useCart();
    const router = useRouter();

    const handlePreOrder = () => {
        if (product) {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price
            });
        }
        router.push("/cart");
    };

    return (
        <main className="bg-[#0f172a] min-h-screen text-white overflow-x-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
            <Navbar onPreOrder={handlePreOrder} />

            <div className="space-y-0">
                <Hero onPreOrder={handlePreOrder} />

                <div className="relative z-20">
                    <SmartSearchDemo />
                </div>

                {/* جدول مقایسه */}
                <ComparisonSection product={product} />

                {/* مشخصات فنی کامل (جایگزین بخش قدیمی) */}
                <FullSpecsSection />

                <PricingSection product={product} />

                <FAQSection />

                <TestimonialsSection />
            </div>

            <Footer />
            <ScrollToTop />
        </main>
    );
}