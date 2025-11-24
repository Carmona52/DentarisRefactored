import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("auth_token")?.value;
    const { pathname } = req.nextUrl;

    const publicPaths = ["/auth/login", "/auth/register", "/"];

    if (!token && !publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    if(!token && pathname.startsWith(publicPaths.join("/"))) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (token && publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};