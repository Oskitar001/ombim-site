export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export async function POST(req) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const body = await req.json();
  const {
    user_id,
    plugin_id,
    email_tekla,
    tipo_id,
    max_activaciones,
    fecha_expiracion
  } = body;

  if (!user_id || !plugin_id || !email_tekla || !max_activaciones) {
    return NextResponse.json({
      ok: false,
      error: "Datos incompletos"
    });
  }

  const codigo = crypto.randomUUID();

  const { data, error } = await supabase
    .from("licencias")
    .insert({
      user_id,
      plugin_id,
      email_tekla,
      tipo_id,
      codigo,
      estado: "activa",
      max_activaciones,
      activaciones_usadas: 0,
      fecha_expiracion
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({
      ok: false,
      error: "Error creando licencia"
    });
  }

  return NextResponse.json({
    ok: true,
    error: null,
    licencia: data
  });
}
