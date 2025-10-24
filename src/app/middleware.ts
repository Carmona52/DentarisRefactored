import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("auth_token");

    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.redirect(new URL("dashboard", req.url));
}