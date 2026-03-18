export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdmin } from "@/lib/checkAdmin";

export async function POST(req) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await req.json();

  const { data: licencia } = await supabaseAdmin
    .from("licencias")
    .select("fecha_expiracion")
    .eq("id", id)
    .single();

  const fecha = new Date(licencia?.fecha_expiracion || Date.now());
  fecha.setDate(fecha.getDate() + 30);

  const { error } = await supabaseAdmin
    .from("licencias")
    .update({ fecha_expiracion: fecha.toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Licencia ampliada 30 días" });
}
