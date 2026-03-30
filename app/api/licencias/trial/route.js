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

  // ✔ Manejo de error en SELECT
  const { data: lic, error: licError } = await supabaseAdmin
    .from("licencias")
    .select("id")
    .eq("id", licencia_id)
    .single();

  if (licError || !lic) {
    console.error("Error buscando licencia:", licError);
    return NextResponse.json({ error: "Licencia no encontrada" }, { status: 404 });
  }

  // ✔ Manejo de error en UPDATE
  const { error: updateErr } = await supabaseAdmin
    .from("licencias")
    .update({ estado: "trial" })
    .eq("id", licencia_id);

  if (updateErr) {
    console.error("Error actualizando licencia:", updateErr);
    return NextResponse.json({ error: "Error actualizando" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}