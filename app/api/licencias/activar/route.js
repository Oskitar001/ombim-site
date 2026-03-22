import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const { licencia_id } = body;

  if (!licencia_id) {
    return NextResponse.json({ error: "Falta licencia_id" }, { status: 400 });
  }

  await supabaseAdmin
    .from("licencias")
    .update({ estado: "activa" })
    .eq("id", licencia_id);

  return NextResponse.json({ ok: true });
}
