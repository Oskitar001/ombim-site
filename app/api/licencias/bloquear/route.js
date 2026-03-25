import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin.ok) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { licencia_id } = await req.json();
  if (!licencia_id)
    return NextResponse.json({ error: "Falta licencia_id" }, { status: 400 });

  const { data: lic } = await supabaseAdmin
    .from("licencias")
    .select("id")
    .eq("id", licencia_id)
    .single();

  if (!lic)
    return NextResponse.json({ error: "Licencia no encontrada" }, { status: 404 });

  await supabaseAdmin.from("licencias").update({ estado: "bloqueada" }).eq("id", licencia_id);

  return NextResponse.json({ ok: true });
}