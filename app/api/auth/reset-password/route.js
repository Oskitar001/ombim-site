import { NextResponse } from "next/server";
import { supabaseRoute } from "@/lib/supabaseRoute";

export async function POST(req) {
  const { email } = await req.json();
  const supabase = supabaseRoute();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: process.env.NEXT_PUBLIC_SITE_URL + "/reset-password",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}