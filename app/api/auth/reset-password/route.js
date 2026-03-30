// /app/api/auth/reset/route.js
import { NextResponse } from "next/server";
import { supabaseRoute } from "@/lib/supabaseRoute";

export async function POST(req) {
  const body = await req.json();
  const email = body?.email?.trim()?.toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "email_requerido" }, { status: 400 });
  }

  // ✔ FIX: supabaseRoute es async en Next.js 16
  const supabase = await supabaseRoute();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  if (error) {
    console.error("Error enviando reset password:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}