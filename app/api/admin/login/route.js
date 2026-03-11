import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { user, pass } = await req.json();

  if (
    user !== process.env.ADMIN_USER ||
    pass !== process.env.ADMIN_PASS
  ) {
    return NextResponse.json({ ok: false });
  }

  // Crear token
  const token = jwt.sign(
    { user },
    process.env.ADMIN_SECRET,
    { expiresIn: "7d" }
  );

  const res = NextResponse.json({ ok: true });

  // Guardar cookie
  res.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
