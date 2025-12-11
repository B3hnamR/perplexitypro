import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAdmin = req.auth?.user && (req.auth.user as any).role === "ADMIN";
    const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");
    const isOnAdminApi = req.nextUrl.pathname.startsWith("/api/admin");
    const isOnLogin = req.nextUrl.pathname.startsWith("/admin/login");

    // Protect admin pages
    if (isOnAdmin) {
        if (!isLoggedIn || !isAdmin) {
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }
        if (isOnLogin && isLoggedIn && isAdmin) {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
    }

    // Protect admin APIs with role check
    if (isOnAdminApi) {
        if (!isLoggedIn || !isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.next();
    }

    return null;
});

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
