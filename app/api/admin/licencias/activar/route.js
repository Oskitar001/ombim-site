export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdmin } from "@/lib/checkAdmin";

export async function POST(req) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { licencia_id, hardware_id } = await req.json();

  const { data: licencia } = await supabaseAdmin
    .from("licencias")
    .select("*")
    .eq("id", licencia_id)
    .single();

  if (!licencia)
    return NextResponse.json({ error: "Licencia no encontrada" }, { status: 404 });

  if (licencia.activaciones_usadas >= licencia.max_activaciones)
    return NextResponse.json({ error: "Máximo de activaciones alcanzado" }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("licencia_activaciones")
    .insert([{ licencia_id, hardware_id }]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabaseAdmin
    .from("licencias")
    .update({ activaciones_usadas: licencia.activaciones_usadas + 1 })
    .eq("id", licencia_id);

  return NextResponse.json({ message: "Activación añadida" });
}
