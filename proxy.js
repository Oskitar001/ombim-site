import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("session")?.value;

  const url = req.nextUrl.pathname;

  // Rutas públicas
  if (
    url.startsWith("/empresa/login") ||
    url.startsWith("/admin/login") ||
    url.startsWith("/success") ||
    url.startsWith("/cancel") ||
    url.startsWith("/comprar") ||
    url.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  if (!token) {
    if (url.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    if (url.startsWith("/empresa")) {
      return NextResponse.redirect(new URL("/empresa/login", req.url));
    }
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/empresa/login", req.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/empresa/:path*",
  ],
};
