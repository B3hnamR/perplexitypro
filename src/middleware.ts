import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isOnAdmin = req.nextUrl.pathname.startsWith("/admin");
    const isOnLogin = req.nextUrl.pathname.startsWith("/admin/login");

    if (isOnAdmin) {
        if (isOnLogin) {
            if (isLoggedIn) {
                return NextResponse.redirect(new URL("/admin/dashboard", req.url));
            }
            return null;
        }

        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }
    }

    return null;
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
