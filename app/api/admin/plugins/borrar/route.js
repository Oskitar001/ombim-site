// app/api/admin/plugins/borrar/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Falta id" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("plugins").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}