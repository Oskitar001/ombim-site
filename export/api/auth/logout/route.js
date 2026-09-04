import { NextResponse } from "next/server";

export async function POST() {
  // Respuesta JSON inicial
  const res = NextResponse.json({ ok: true });

  // Opciones unificadas para eliminar cookies de sesión
  const baseOptions = {
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  // ✔ Borrar cookies oficiales de Supabase
  res.cookies.set("sb-access-token", "", baseOptions);
  res.cookies.set("sb-refresh-token", "", baseOptions);

  // ❌ ESTA cookie no existe oficialmente → eliminada
  // res.cookies.set("supabase-auth-token", "", baseOptions);

  // ✔ Borrar cookie de rol con mismas opciones
  res.cookies.set("sb-user-role", "", {
    ...baseOptions,
    httpOnly: false, // tu cookie de rol NO es httpOnly en login → lo mantengo.
  });

  return res;
}