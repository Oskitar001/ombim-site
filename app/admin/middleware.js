import { NextResponse } from "next/server";

export function middleware(req) {
  const { nextUrl, cookies } = req;
  const { pathname, search } = nextUrl;

  // Rutas protegidas
  const isProtected = pathname.startsWith("/app/sfmn");

  // Excepciones
  const isLoginPage = pathname === "/app/sfmn/login";
  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/images") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".svg");

  if (!isProtected || isLoginPage || isPublicAsset) {
    return NextResponse.next();
  }

  // Comprobar cookie
  const token = cookies.get("admin_token")?.value;
  if (!token) {
    const loginUrl = nextUrl.clone();
    loginUrl.pathname = "/app/sfmn/login";
    const nextTarget = pathname + (search || "");
    loginUrl.searchParams.set("next", nextTarget);
