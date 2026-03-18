export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdmin } from "@/lib/checkAdmin";

export async function POST(req) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await req.json();
  const { email_tekla, plugin_id, tipo_id, fecha_expiracion, notas } = body;

  if (!email_tekla || !plugin_id)
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });

  const { data: existe } = await supabaseAdmin
    .from("licencias")
    .select("id")
    .eq("email_tekla", email_tekla)
    .eq("plugin_id", plugin_id)
    .maybeSingle();

  if (existe)
    return NextResponse.json(
      { error: "Ya existe una licencia para este email Tekla y plugin" },
      { status: 400 }
    );

  const { data, error } = await supabaseAdmin
    .from("licencias")
    .insert([{ email_tekla, plugin_id, tipo_id, fecha_expiracion, notas }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Licencia creada correctamente", licencia: data });
}
