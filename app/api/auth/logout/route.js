import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logout OK" });

  res.cookies.set("session", "", {
    httpOnly: true,
    secure: true,        // 🔥 obligatorio en HTTPS
    sameSite: "lax",     // 🔥 necesario para móvil
    path: "/",
    maxAge: 0            // 🔥 borra la cookie correctamente
  });

  return res;
}
