import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect("/admin/login");

  res.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 0,
  });

  return res;
}
