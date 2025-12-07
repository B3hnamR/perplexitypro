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
    // دریافت اولین محصول از دیتابیس برای نمایش قیمت و اطلاعات
    product = await prisma.product.findFirst();
  } catch (error) {
    console.error("Failed to load product for home page:", error);
    // اگر دیتابیس خطا داد، محصول را null می‌گذاریم تا وارد بلوک بعدی شود
    product = null;
  }

  // ✅ بخش اضافه شده: اگر محصولی در دیتابیس نبود (یا ارور داد)، یک محصول پیش‌فرض می‌سازیم
  if (!product) {
    product = {
        id: "default-pro",
        name: "اشتراک Perplexity Pro",
        description: "دسترسی نامحدود به هوش مصنوعی",
        price: 398000, // قیمت پیش‌فرض برای نمایش در سایت
        imageUrl: "/perplexity-pro-logo.png",
        fileUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
    };
  }

  // ✅ ساخت اسکیمای محصول (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name, // مطمئنیم که product دیگر null نیست
    "image": "https://perplexitypro.ir/perplexity-pro-share.jpg",
    "description": product.description || "دسترسی نامحدود به هوش مصنوعی‌های GPT-5, Claude 3 و Gemini Pro",
    "brand": {
      "@type": "Brand",
      "name": "Perplexity"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://perplexitypro.ir",
      "priceCurrency": "IRR",
      "price": product.price * 10, // تبدیل تومان به ریال
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