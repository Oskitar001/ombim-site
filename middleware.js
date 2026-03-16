import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.pathname;

  // Rutas públicas
  const publicRoutes = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/me",
    "/api/auth/logout",
    "/api/plugin",
    "/plugins",
    "/"
  ];

  // Permitir rutas públicas
  if (publicRoutes.some(route => url.startsWith(route))) {
    return NextResponse.next();
  }

  // Proteger descargas
  if (url.startsWith("/api/download")) {
    const session = req.cookies.get("session")?.value;

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    return NextResponse.next();
  }

  // Por defecto permitir
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/plugins/:path*"],
};
