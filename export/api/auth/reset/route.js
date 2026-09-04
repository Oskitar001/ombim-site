// /app/api/auth/reset/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req) {
  const token = req.nextUrl.searchParams.get("token")?.trim();
  const emailRaw = req.nextUrl.searchParams.get("email");

  const email = emailRaw?.trim()?.toLowerCase();

  if (!token || !email) {
    return NextResponse.redirect("/login?error=missing_token");
  }

  // ✔ FIX: supabaseServer() es async
  const supabase = await supabaseServer();

  // ✔ FIX: tipo correcto en verifyOtp
  const { error } = await supabase.auth.verifyOtp({
    token,
    email,
    type: "recovery", // ← el valor correcto para reset de contraseña
  });

  if (error) {
    console.error("Error verifyOtp:", error);
    return NextResponse.redirect("/login?error=verify_failed");
  }

  return NextResponse.redirect("/panel");
}