import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export async function POST(req) {
  const { plugin_id, user_id } = await req.json();

  if (!plugin_id || !user_id) {
    return NextResponse.json(
      { error: "plugin_id y user_id requeridos" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Generar clave segura
  const clave = crypto.randomUUID();

  // Insertar clave
  const { error } = await supabase.from("claves_entregadas").insert({
    user_id,
    plugin_id,
    clave,
    revocada: false,
    revocada_por_abuso: false
  });

  if (error) {
    return NextResponse.json(
      { error: "No se pudo generar la clave" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, clave });
}
