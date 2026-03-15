import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;

  const adminToken = req.cookies.get("admin_token")?.value;
  const clientToken = req.cookies.get("client_token")?.value;

  const path = url.pathname;

  // Rutas reales
  const isAdminRoute = path.startsWith("/admin");
  const isClientRoute = path.startsWith("/cliente");

  const isAdminLogin = path === "/admin/login";
  const isClientLogin = path === "/login";

  // ADMIN
  if (isAdminRoute && !isAdminLogin) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // CLIENTE
  if (isClientRoute && !isClientLogin) {
    if (!clientToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/cliente/:path*"
  ]
};
