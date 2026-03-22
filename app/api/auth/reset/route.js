import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req) {
  const token = req.nextUrl.searchParams.get("token");
  const email = req.nextUrl.searchParams.get("email");

  if (!token || !email) {
    return NextResponse.redirect("/login?error=missing_token");
  }

  const supabase = await supabaseServer();

  // Verificar email
  const { data, error } = await supabase.auth.verifyOtp({
    token,
    email,
    type: "email"
  });

  if (error) {
    console.error("VERIFY ERROR:", error);
    return NextResponse.redirect("/login?error=verify_failed");
  }

  // Obtener sesión (si Supabase la genera)
  const { data: sessionData } = await supabase.auth.getSession();

  // Redirigir al panel
  return NextResponse.redirect("/panel");
}
