// app/api/licencias/reset-activaciones/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { licencia_id } = await req.json();

  if (!licencia_id) {
    return NextResponse.json({ error: "Falta licencia_id" }, { status: 400 });
  }

  // comprobar existencia
  const { data: lic } = await supabaseAdmin
    .from("licencias")
    .select("id")
    .eq("id", licencia_id)
    .single();

  if (!lic) {
    return NextResponse.json({ error: "Licencia no encontrada" }, { status: 404 });
  }

  const { error } = await supabaseAdmin
    .from("licencias")
    .update({ activaciones_usadas: 0 })
    .eq("id", licencia_id);

  if (error) {
    return NextResponse.json({ error: "Error actualizando" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}