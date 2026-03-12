import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl;

  const adminToken = req.cookies.get("admin_token")?.value;
  const clientToken = req.cookies.get("client_token")?.value;

  const isAdminRoute = url.pathname.startsWith("/admin");
  const isClientRoute = url.pathname.startsWith("/cliente");

  const isAdminLogin = url.pathname === "/admin-login";
  const isClientLogin = url.pathname === "/login";

  // ADMIN
  if (isAdminRoute && !isAdminLogin) {
    if (!adminToken) {
      url.pathname = "/admin-login";
      return NextResponse.redirect(url);
    }
  }

  // CLIENTE
  if (isClientRoute && !isClientLogin) {
    if (!clientToken) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/cliente/:path*"],
};
