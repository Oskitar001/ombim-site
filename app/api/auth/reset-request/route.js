// /app/api/auth/reset-request/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  const body = await req.json();
  const email = body?.email?.trim()?.toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Falta email" }, { status: 400 });
  }

  // ✔ FIX: supabaseServer es async
  const supabase = await supabaseServer();

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    console.error("Error enviando reset password:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    message: "Enlace enviado. Revisa tu correo.",
  });
}