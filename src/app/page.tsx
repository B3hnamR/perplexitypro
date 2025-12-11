import HomeClient from "@/components/HomeClient";
import { prisma } from "@/lib/db";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "OrOñUOO_ OO'O¦OñOUc Perplexity Pro | O¦O-U^UOU, O›U+UO U^ OOñOýOU+",
  description: "O\"UØO¦OñUOU+ U.OñOªO1 OrOñUOO_ OUcOU+O¦ U_OñU_U,UcO3UOO¦UO U_OñU^ O_Oñ OUOOñOU+. O_O3O¦OñO3UO U+OU.O-O_U^O_ O\"UØ GPT-5 U^ Claude 3 O\"O U_O'O¦UOO\"OU+UO UýU' O3OO1O¦UØ.",
};

export default async function Home() {
  let product = null;

  if (process.env.DATABASE_URL) {
    try {
      product = await prisma.product.findFirst();
    } catch (error) {
      console.error("Failed to load product for home page:", error);
      product = null;
    }
  }

  if (!product) {
    product = {
        id: "default-pro",
        name: "OO'O¦OñOUc Perplexity Pro",
        description: "O_O3O¦OñO3UO U+OU.O-O_U^O_ O\"UØ UØU^O' U.OæU+U^O1UO",
        price: 398000,
        imageUrl: "/perplexity-pro-logo.png",
        fileUrl: null,
        createdAt: new Date(),
        updatedAt: new Date()
    };
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": "https://perplexitypro.ir/perplexity-pro-share.jpg",
    "description": product.description || "O_O3O¦OñO3UO U+OU.O-O_U^O_ O\"UØ UØU^O' U.OæU+U^O1UOƒ?OUØOUO GPT-5, Claude 3 U^ Gemini Pro",
    "brand": {
      "@type": "Brand",
      "name": "Perplexity"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://perplexitypro.ir",
      "priceCurrency": "IRR",
      "price": product.price * 10,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient product={product} />
    </>
  );
}
