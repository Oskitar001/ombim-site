import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function proxy(request) {
  const pathname = request.nextUrl.pathname;

  // Ignorar rutas internas de Next.js
  if (pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  // Rutas protegidas
  const protectedRoutes = [
    "/panel",
    "/usuario",
    "/plugins",
    "/api/download"
  ];

  if (protectedRoutes.some(r => pathname.startsWith(r))) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Rutas admin
  const adminRoutes = [
    "/admin",
    "/api/admin"
  ];

  if (adminRoutes.some(r => pathname.startsWith(r))) {
    if (!user || user.user_metadata?.role !== "admin") {
      return NextResponse.redirect(new URL("/panel", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/panel",
    "/panel/:path*",
    "/usuario",
    "/usuario/:path*",
    "/plugins",
    "/plugins/:path*",
    "/api/download/:path*",
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
