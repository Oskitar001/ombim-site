import { NextResponse } from "next/server";

export function proxy(request) {
  const pathname = request.nextUrl.pathname;
  const clean = pathname.replace(/\/+/g, "/");

  // Leer cookies de sesión
  const hasSession =
    request.cookies.get("sb-access-token") ||
    request.cookies.get("supabase-auth-token");

  const role = request.cookies.get("sb-user-role")?.value;

  // -----------------------------
  // 1. RUTAS PROTEGIDAS
  // -----------------------------
  const protectedRoutes = [
    "/panel",
    "/usuario",
    "/plugins",
    "/api/download",
  ];

  if (protectedRoutes.some((r) => clean.startsWith(r))) {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // -----------------------------
  // 2. ADMIN: REDIRECCIÓN DE /panel
  // -----------------------------
  if (role === "admin" && clean === "/panel") {
    return NextResponse.redirect(new URL("/panel/admin", request.url));
  }

  // -----------------------------
  // 3. RUTAS EXCLUSIVAS DE ADMIN
  // -----------------------------
  const adminOnly = ["/admin", "/api/admin"];

  if (adminOnly.some((r) => clean.startsWith(r))) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/panel", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/panel",
    "/panel/:path*",
    "/usuario",
    "/usuario/:path*",
    "/plugins",
    "/plugins/:path*",
    "/api/download/:path*",
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
