// /app/api/auth/reset-request/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Falta email" }, { status: 400 });
  }

  const supabase = supabaseServer();

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    message: "Enlace enviado. Revisa tu correo.",
  });
}