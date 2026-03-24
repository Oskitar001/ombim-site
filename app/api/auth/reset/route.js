// /app/api/auth/reset/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req) {
  const token = req.nextUrl.searchParams.get("token");
  const email = req.nextUrl.searchParams.get("email");

  if (!token || !email) {
    return NextResponse.redirect("/login?error=missing_token");
  }

  const supabase = supabaseServer();

  const { error } = await supabase.auth.verifyOtp({
    token,
    email,
    type: "email",
  });

  if (error) {
    return NextResponse.redirect("/login?error=verify_failed");
  }

  return NextResponse.redirect("/panel");
}