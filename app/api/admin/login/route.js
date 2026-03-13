// app/api/admin/login/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json();

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");

    const res = NextResponse.json({ success: true });

    res.cookies.set("admin_token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 4 // 4 horas
    });

    return res;
  }

  return NextResponse.json({ success: false });
}
