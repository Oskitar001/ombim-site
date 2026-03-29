// /app/api/user/update/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function POST(req) {
  const supabase = await supabaseServer();
  const body = await req.json();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "no_autenticado" }, { status: 401 });
  }

  const { nombre, empresa, telefono, pais } = body;

  // SOLO actualizar user_metadata
  await supabase.auth.updateUser({
    data: { nombre, empresa, telefono, pais },
  });

  return NextResponse.json({ ok: true });
}