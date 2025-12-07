"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SmartSearchDemo from "@/components/SmartSearchDemo";
import ComparisonSection from "@/components/ComparisonSection";
import FullSpecsSection from "@/components/FullSpecsSection";
import PricingSection from "@/components/PricingSection"; // مطمئن شوید این فایل export default دارد
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
// import TestimonialsSection from "@/components/TestimonialsSection"; 

interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    imageUrl?: string | null;
}

interface HomeClientProps {
    product: Product; // تایپ را دقیق‌تر کردیم
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

                <ComparisonSection product={product} />

                <FullSpecsSection />

                <PricingSection product={product} />

                <FAQSection />

                {/* <TestimonialsSection /> */}
            </div>

            <Footer />
            <ScrollToTop />
        </main>
    );
}