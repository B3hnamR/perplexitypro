import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://perplexitypro.ir"), // ⚠️ دامین واقعی خود را جایگزین کنید
  title: {
    default: "خرید اشتراک Perplexity Pro | دستیار هوش مصنوعی پرپلکسیتی",
    template: "%s | پرپلکسیتی پرو",
  },
  description: "خرید اکانت Perplexity Pro با تحویل آنی. دسترسی نامحدود به GPT-5.1، Claude Sonnet 4.5 و Gemini 3 Pro. بهترین جایگزین ChatGPT پلاس در ایران.",
  keywords: ["خرید Perplexity Pro", "اکانت پرپلکسیتی", "هوش مصنوعی", "GPT-5", "Claude 3", "تحقیق علمی", "دستیار هوشمند"],
  authors: [{ name: "PerplexityPro Team" }],
  creator: "PerplexityPro",
  publisher: "PerplexityPro",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://perplexitypro.ir",
    siteName: "Perplexity Pro Iran",
    title: "خرید اشتراک Perplexity Pro | دسترسی به GPT-5 و Claude 3",
    description: "با پرپلکسیتی پرو، قدرت تمام مدل‌های هوش مصنوعی را یکجا داشته باشید. جستجوی زنده، تحلیل فایل و کدنویسی حرفه‌ای.",
    images: [
      {
        url: "/perplexity-pro-share.jpg", // ⚠️ یک عکس با کیفیت ۱۲۰۰ در ۶۳۰ در پوشه public قرار دهید
        width: 1200,
        height: 630,
        alt: "Perplexity Pro Subscription",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "خرید اشتراک Perplexity Pro",
    description: "دسترسی نامحدود به برترین مدل‌های هوش مصنوعی جهان.",
    images: ["/perplexity-pro-share.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png", // ⚠️ فایل آیکون اپل را در public بگذارید
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazirmatn.variable} font-sans bg-[#0f172a] text-white antialiased selection:bg-cyan-500/30 selection:text-cyan-200`} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}