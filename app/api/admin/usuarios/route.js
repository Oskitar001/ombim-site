// app/api/admin/usuarios/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();

  const { error } = await supabaseAdmin
    .from("usuarios")
    .insert(body);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}