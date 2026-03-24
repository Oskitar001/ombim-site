import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });

  const cookieOptions = {
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  res.cookies.set("sb-access-token", "", cookieOptions);
  res.cookies.set("sb-refresh-token", "", cookieOptions);
  res.cookies.set("supabase-auth-token", "", cookieOptions);

  res.cookies.set("sb-user-role", "", { maxAge: 0, path: "/" });

  return res;
}