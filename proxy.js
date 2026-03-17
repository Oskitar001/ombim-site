import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.pathname;

  // Cookies disponibles en Edge Runtime
  const session = req.cookies.get("session")?.value;
  const role = req.cookies.get("role")?.value || "user";

  // -----------------------------
  // RUTAS PÚBLICAS
  // -----------------------------
  const publicRoutes = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/me",
    "/api/auth/logout",
    "/api/plugin",
    "/plugins",
    "/"
  ];

  if (publicRoutes.some(route => url.startsWith(route))) {
    return NextResponse.next();
  }

  // -----------------------------
  // PROTEGER DESCARGAS
  // -----------------------------
  if (url.startsWith("/api/download")) {
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // -----------------------------
  // PROTEGER RUTAS ADMIN
  // -----------------------------
  if (url.startsWith("/admin") || url.startsWith("/api/admin")) {
    if (!session || role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // -----------------------------
  // PROTEGER RUTAS USER
  // -----------------------------
  if (url.startsWith("/panel") || url.startsWith("/usuario")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/panel/:path*",
    "/usuario/:path*",
    "/api/download/:path*",
    "/api/:path*",
    "/plugins/:path*"
  ],
};
