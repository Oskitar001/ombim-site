import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect("/login?error=missing_token");
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // 1. Verificar email
  const { data, error } = await supabase.auth.verifyOtp({
    token,
    type: "email"
  });

  if (error) {
    console.error(error);
    return NextResponse.redirect("/login?error=verify_failed");
  }

  // 2. Iniciar sesión automáticamente
  const session = data.session;

  if (!session) {
    return NextResponse.redirect("/login?error=no_session");
  }

  // 3. Guardar cookie
  const cookieStore = await cookies();
  cookieStore.set("session", session.access_token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/"
  });

  // 4. Redirigir al usuario logueado
  return NextResponse.redirect("/dashboard");
}
