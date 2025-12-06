import HomeClient from "@/components/HomeClient";
import { prisma } from "@/lib/db";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

// متادیتای تکمیلی مخصوص صفحه اصلی
export const metadata: Metadata = {
  title: "خرید اشتراک Perplexity Pro | تحویل آنی و ارزان",
  description: "بهترین مرجع خرید اکانت پرپلکسیتی پرو در ایران. دسترسی نامحدود به GPT-5 و Claude 3 با پشتیبانی ۲۴ ساعته.",
};

export default async function Home() {
  let product = null;
  try {
    product = await prisma.product.findFirst();
  } catch (error) {
    console.error("Failed to load product for home page:", error);
    product = null;
  }

  // ✅ ساخت اسکیمای محصول (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product?.name || "Perplexity Pro Subscription",
    "image": "https://perplexitypro.ir/perplexity-pro-share.jpg", // آدرس عکس محصول
    "description": product?.description || "دسترسی نامحدود به هوش مصنوعی‌های GPT-5, Claude 3 و Gemini Pro",
    "brand": {
      "@type": "Brand",
      "name": "Perplexity"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://perplexitypro.ir",
      "priceCurrency": "IRR",
      "price": product ? product.price * 10 : 3980000, // تبدیل تومان به ریال (استاندارد گوگل)
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "PerplexityPro Iran"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "120"
    }
  };

  return (
    <>
      {/* تزریق اسکیما به صفحه */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient product={product} />
    </>
  );
}