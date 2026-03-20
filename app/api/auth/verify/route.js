import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect("/login?error=missing_token");
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Verificar email en Supabase Auth
  const { data, error } = await supabase.auth.verifyOtp({
    token,
    type: "email"
  });

  if (error) {
    console.error(error);
    return NextResponse.redirect("/login?error=verify_failed");
  }

  // Crear cookie de sesión
  const session = data.session;
  const cookieStore = await cookies();

  cookieStore.set("session", session.access_token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/"
  });

  return NextResponse.redirect("/dashboard");
}
