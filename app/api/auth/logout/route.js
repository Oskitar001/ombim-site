import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST() {
  const supabase = await supabaseServer();

  // Cerrar sesión en Supabase (invalida tokens y cookies)
  await supabase.auth.signOut();

  return NextResponse.json({ ok: true });
}
