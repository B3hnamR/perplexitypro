import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/admin/",
                "/api/",
                "/auth/",
                "/cart/",
                "/profile/",
                "/track/",
                "/delivery/",
                "/payment/",
            ],
        },
        sitemap: "https://perplexitypro.ir/sitemap.xml", // ⚠️ دامین خود را ست کنید
    };
}