// app/api/admin/usuarios/[id]/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(_, { params }) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { data } = await supabaseAdmin
    .from("usuarios")
    .select("*, licencias(*), pagos(*)")
    .eq("id", params.id)
    .single();

  return NextResponse.json(data);
}

export async function PUT(req, { params }) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();

  const { error } = await supabaseAdmin
    .from("usuarios")
    .update(body)
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}