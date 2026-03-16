import { NextResponse } from "next/server";

export function proxy(req) {
  const url = req.nextUrl.pathname;

  // Rutas públicas
  if (
    url.startsWith("/api/auth/login") ||
    url.startsWith("/api/auth/register") ||
    url.startsWith("/api/auth/me") ||
    url.startsWith("/api/plugin") ||
    url.startsWith("/plugins") ||
    url === "/"
  ) {
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/plugins/:path*"],
};
