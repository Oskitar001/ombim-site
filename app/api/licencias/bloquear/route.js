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

  // ✔ Añadir control de error
  const { data: lic, error: licError } = await supabaseAdmin
    .from("licencias")
    .select("id")
    .eq("id", licencia_id)
    .single();

  if (licError || !lic) {
    return NextResponse.json({ error: "Licencia no encontrada" }, { status: 404 });
  }

  // ✔ Controlar error de update
  const { error: updateErr } = await supabaseAdmin
    .from("licencias")
    .update({ estado: "bloqueada" })
    .eq("id", licencia_id);

  if (updateErr) {
    console.error("Error bloqueando licencia:", updateErr);
    return NextResponse.json(
      { error: "error_actualizando" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}