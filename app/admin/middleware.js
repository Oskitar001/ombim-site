import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.pathname;

  if (url.startsWith("/admin") && !url.startsWith("/admin/login")) {
    const session = req.cookies.get("admin_session");

    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
