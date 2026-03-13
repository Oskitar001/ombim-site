// app/api/admin/extender-licencia/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { usuario_id, nueva_fecha } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // Verificar usuario
  const { data: user } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", usuario_id)
    .single();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Usuario no encontrado" });
  }

  // Actualizar fecha exacta
  await supabase
    .from("usuarios")
    .update({ fecha_expiracion: nueva_fecha })
    .eq("id", usuario_id);

  // Log
  await supabase.from("logs").insert({
    usuario_id,
    accion: `extender licencia a ${nueva_fecha}`,
    fecha: new Date().toISOString()
  });

  return NextResponse.json({
    ok: true,
    fecha_expiracion: nueva_fecha
  });
}
