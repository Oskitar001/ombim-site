import { NextResponse } from "next/server";

export function middleware(req) {
  const { nextUrl, cookies } = req;
  const { pathname } = nextUrl;

  // Proteger SOLO el panel admin
  const isAdminRoute = pathname.startsWith("/admin");

  // Página de login admin
  const isAdminLogin = pathname === "/admin/login";

  // Archivos públicos
  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".svg");

  // Si no es ruta admin → permitir
  if (!isAdminRoute || isAdminLogin || isPublicAsset) {
    return NextResponse.next();
  }

  // Comprobar cookie admin
  const token = cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
