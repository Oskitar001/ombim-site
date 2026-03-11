import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const url = req.nextUrl;
  const path = url.pathname;

  // Permitir login sin sesión
  if (path.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // Proteger todo /admin
  if (path.startsWith("/admin")) {
    const token = req.cookies.get("admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      jwt.verify(token, process.env.ADMIN_SECRET);
      return NextResponse.next();
    } catch (e) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
