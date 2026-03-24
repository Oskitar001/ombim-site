// middleware.js — versión compatible con Next.js 16
import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl;
  const { pathname } = url;

  // Cookies (Next 16 API)
  const access = request.cookies.get("sb-access-token")?.value;
  const refresh = request.cookies.get("supabase-auth-token")?.value;
  const role = request.cookies.get("sb-user-role")?.value;

  const logged = access || refresh;

  // Rutas protegidas para usuarios normales
  const userProtected = [
    "/panel",
    "/panel/user",
    "/panel/mis-",
    "/pago",
  ];

  if (userProtected.some((r) => pathname.startsWith(r))) {
    if (!logged) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Rutas solo para admin
  const adminProtected = [
    "/panel/admin",
    "/api/admin",
  ];

  if (adminProtected.some((r) => pathname.startsWith(r))) {
    if (role !== "admin") {
      url.pathname = "/panel/user";
      return NextResponse.redirect(url);
    }
  }

  // Redirección automática /panel según rol
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

export const config = {
  matcher: [
    "/panel/:path*",
    "/pago/:path*",
    "/api/admin/:path*",
  ],
};