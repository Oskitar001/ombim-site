import { NextResponse } from "next/server";

export default function proxy(req) {
  const res = NextResponse.next();

  // Añadimos el origin real del request (SIEMPRE existe)
  res.headers.set("x-origin", req.nextUrl.origin);

  return res;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/panel/:path*",
    "/usuario/:path*",
    "/api/download/:path*",
    "/plugins/:path*"
  ],
};
