import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import MaintenanceScreen from "@/components/MaintenanceScreen";
import HeaderWrapper from "@/components/HeaderWrapper"; // ✅ فایل جدید
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

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
  metadataBase: new URL("https://perplexitypro.ir"),
  title: {
    default: "خرید اشتراک Perplexity Pro | دستیار هوش مصنوعی پرپلکسیتی",
    template: "%s | پرپلکسیتی پرو",
  },
  description: "خرید اکانت Perplexity Pro با تحویل آنی. دسترسی نامحدود به GPT-5.1، Claude Sonnet 4.5 و Gemini 3 Pro. بهترین جایگزین ChatGPT پلاس در ایران.",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const maintenanceSetting = await prisma.setting.findUnique({ where: { key: "maintenance_mode" } });
  const isMaintenance = maintenanceSetting?.value === "true";
  
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazirmatn.variable} font-sans bg-[#0f172a] text-white antialiased selection:bg-cyan-500/30 selection:text-cyan-200`} suppressHydrationWarning>
        <Providers>
          
          {isMaintenance && !isAdmin ? (
             <MaintenanceScreen />
          ) : (
             <>
                <HeaderWrapper /> {/* ✅ مدیریت هدر و اعلانات یکجا */}
                {children}
             </>
          )}

        </Providers>
      </body>
    </html>
  );
}