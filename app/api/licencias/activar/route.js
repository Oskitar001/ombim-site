import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  let body = {};
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { email_tekla, clave, hardware_id } = body;

  if (!email_tekla || !clave || !hardware_id) {
    return NextResponse.json(
      { error: "Faltan campos: email_tekla, clave, hardware_id" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // 1. Buscar licencia
  const { data: licencia, error: licError } = await supabase
    .from("licencias")
    .select("*")
    .eq("email_tekla", email_tekla)
    .eq("clave", clave)
    .single();

  if (licError || !licencia) {
    return NextResponse.json(
      { error: "Licencia no encontrada o clave incorrecta" },
      { status: 404 }
    );
  }

  if (licencia.estado !== "activa") {
    return NextResponse.json(
      { error: `Licencia no activa (estado: ${licencia.estado})` },
      { status: 400 }
    );
  }

  // 2. Comprobar si ya existe activación para ese hardware
  const { data: activacionExistente } = await supabase
    .from("licencia_activaciones")
    .select("*")
    .eq("licencia_id", licencia.id)
    .eq("hardware_id", hardware_id)
    .maybeSingle();

  if (activacionExistente) {
    return NextResponse.json(
      { ok: true, message: "Licencia ya activada en este hardware" },
      { status: 200 }
    );
  }

  // 3. Comprobar límite de activaciones
  if (
    licencia.max_activaciones !== null &&
    licencia.activaciones_usadas >= licencia.max_activaciones
  ) {
    return NextResponse.json(
      { error: "Se ha alcanzado el máximo de activaciones" },
      { status: 400 }
    );
  }

  // 4. Registrar nueva activación
  const { error: actError } = await supabase
    .from("licencia_activaciones")
    .insert({
      licencia_id: licencia.id,
      hardware_id
    });

  if (actError) {
    return NextResponse.json(
      { error: "Error registrando activación" },
      { status: 500 }
    );
  }

  // 5. Incrementar contador de activaciones
  const { error: updateLicError } = await supabase
    .from("licencias")
    .update({
      activaciones_usadas: (licencia.activaciones_usadas || 0) + 1
    })
    .eq("id", licencia.id);

  if (updateLicError) {
    return NextResponse.json(
      { error: "Error actualizando contador de activaciones" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      message: "Licencia activada correctamente",
      plugin_id: licencia.plugin_id
    },
    { status: 200 }
  );
}
