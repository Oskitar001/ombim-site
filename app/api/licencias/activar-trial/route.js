import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const body = await req.json();
  const { user_id, plugin_id } = body;

  if (!user_id || !plugin_id) {
    return NextResponse.json({
      ok: false,
      error: "Datos incompletos"
    });
  }

  // 1. Comprobar si ya tiene trial
  const { data: trialExistente } = await supabase
    .from("licencias")
    .select("*")
    .eq("user_id", user_id)
    .eq("plugin_id", plugin_id)
    .eq("estado", "trial")
    .single();

  if (trialExistente) {
    return NextResponse.json({
      ok: true,
      error: null,
      licencia_id: trialExistente.id,
      expira: trialExistente.fecha_expiracion
    });
  }

  // 2. Crear trial (7 días)
  const fechaExp = new Date();
  fechaExp.setDate(fechaExp.getDate() + 7);

  const { data: nuevaTrial } = await supabase
    .from("licencias")
    .insert({
      user_id,
      plugin_id,
      codigo: `TRIAL-${crypto.randomUUID()}`,
      estado: "trial",
      max_activaciones: 1,
      fecha_expiracion: fechaExp
    })
    .select()
    .single();

  return NextResponse.json({
    ok: true,
    error: null,
    licencia_id: nuevaTrial.id,
    expira: nuevaTrial.fecha_expiracion
  });
}
