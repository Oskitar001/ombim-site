// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  const access = request.cookies.get("sb-access-token")?.value;
  const role = request.cookies.get("sb-user-role")?.value;
  const logged = Boolean(access);

  // ============================
  // PROTECCIÓN PARA /pago/*
  // ============================
  if (pathname.startsWith("/pago")) {
    if (!logged) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ============================
  // PANEL ADMIN
  // ============================
  if (pathname.startsWith("/panel/admin")) {
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

  // ============================
  // PANEL USUARIO
  // ============================
  if (pathname.startsWith("/panel/user")) {
    if (!logged) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ============================
  // ACCESO A /panel DIRECTO
  // ============================
  if (pathname === "/panel") {
    if (!logged) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    url.pathname = role === "admin" ? "/panel/admin" : "/panel/user";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/panel",
    "/panel/:path*",
    "/pago/:path*",
    "/api/admin/:path*"
  ],
};