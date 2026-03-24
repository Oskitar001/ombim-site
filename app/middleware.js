import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const cleaned = pathname.replace(/\/+/g, "/");

  const hasSession =
    request.cookies.get("sb-access-token") ||
    request.cookies.get("supabase-auth-token");

  const role = request.cookies.get("sb-user-role")?.value;

  // 🔒 Rutas protegidas (deben tener sesión)
  const protectedRoutes = ["/panel", "/usuario", "/plugins", "/api/download"];
  if (protectedRoutes.some((r) => cleaned.startsWith(r))) {
    if (!hasSession) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  // 👑 Redirección automática de /panel según rol
  if (cleaned === "/panel") {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/panel/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/panel/user", request.url));
    }
  }

  // 🔒 Solo admin
  const adminRoutes = ["/admin", "/api/admin"];
  if (adminRoutes.some((r) => cleaned.startsWith(r))) {
    if (role !== "admin") {
      const url = new URL("/panel", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Rutas que activan este middleware
export const config = {
  matcher: [
    "/panel/:path*",
    "/usuario/:path*",
    "/plugins/:path*",
    "/api/download/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
