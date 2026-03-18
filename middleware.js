import { NextResponse } from "next/server";

export function middleware(request) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;

  // Proxy: añadimos el origin real
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  response.headers.set("x-origin", nextUrl.origin);

  // Leer cookie de sesión (como string, sin JSON.parse)
  const sessionCookie = cookies.get("session")?.value || "";

  // Rutas que requieren admin
  const isAdminRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin");

  if (isAdminRoute) {
    // Si no hay cookie → fuera
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Comprobación segura para Edge Runtime
    const isAdmin = sessionCookie.includes(`"role":"admin"`);

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/panel/:path*",
    "/usuario/:path*",
    "/api/download/:path*",
    "/plugins/:path*",
  ],
};
