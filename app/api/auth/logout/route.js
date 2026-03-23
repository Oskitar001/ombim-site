import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  // Borrar cookies de Supabase
  response.cookies.set("sb-access-token", "", { maxAge: 0, path: "/" });
  response.cookies.set("sb-refresh-token", "", { maxAge: 0, path: "/" });
  response.cookies.set("supabase-auth-token", "", { maxAge: 0, path: "/" });

  // Borrar cookie del rol
  response.cookies.set("sb-user-role", "", { maxAge: 0, path: "/" });

  return response;
}
