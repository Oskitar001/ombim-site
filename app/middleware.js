// middleware.js — versión final
import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Cookies de Supabase
  const access = request.cookies.get("sb-access-token")?.value;
  const role   = request.cookies.get("sb-user-role")?.value;

  const logged = Boolean(access);

  // ============================================================
  // 1. ADMIN PRIMERO
  // ============================================================
  if (pathname.startsWith("/panel/admin") || pathname.startsWith("/api/admin")) {
    if (!logged) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    if (role !== "admin") {
      url.pathname = "/panel/user";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ============================================================
  // 2. USER
  // ============================================================
  if (
    pathname.startsWith("/panel/user") ||
    pathname.startsWith("/panel/mis-") ||
    pathname.startsWith("/pago")
  ) {
    if (!logged) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ============================================================
  // 3. /panel -> REDIRIGE SEGÚN ROL
  // ============================================================
  if (pathname === "/panel") {
    if (!logged) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    url.pathname = role === "admin"
      ? "/panel/admin"
      : "/panel/user";

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// ============================================================
// MUY IMPORTANTE: EL MATCHER DEBE INCLUIR /panel SOLO
// ============================================================
export const config = {
  matcher: [
    "/panel",
    "/panel/:path*",
    "/pago/:path*",
    "/api/admin/:path*",
  ],
};