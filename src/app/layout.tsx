import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import MaintenanceScreen from "@/components/MaintenanceScreen";
import HeaderWrapper from "@/components/HeaderWrapper";
import ExitPopup from "@/components/ExitPopup";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

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
    default: "پری‌پلکسیتی پرو | دسترسی به مدل‌های برتر هوش مصنوعی",
    template: "%s | پری‌پلکسیتی پرو",
  },
  description: "اشتراک پری‌پلکسیتی پرو با دسترسی به GPT-5، Claude Sonnet 4.5 و Gemini 3 Pro؛ هوش مصنوعی سریع و قابل اتکا برای تحقیق، تولید محتوا و تحلیل.",
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
  let isMaintenance = false;
  if (process.env.DATABASE_URL) {
    try {
      const maintenanceSetting = await prisma.setting.findUnique({ where: { key: "maintenance_mode" } });
      isMaintenance = maintenanceSetting?.value === "true";
    } catch (e) {
      console.error("Maintenance check failed:", e);
      isMaintenance = false;
    }
  }
  
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
                <HeaderWrapper />
                <ExitPopup />
                {children}
             </>
          )}

        </Providers>
      </body>
    </html>
  );
}
