// app/api/admin/crear-licencia/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { usuario_id, dias } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // Obtener usuario
  const { data: user } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", usuario_id)
    .single();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Usuario no encontrado" });
  }

  // Calcular nueva fecha
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + (dias || 30));
  const nuevaFecha = fecha.toISOString();

  // Actualizar licencia
  await supabase
    .from("usuarios")
    .update({
      fecha_expiracion: nuevaFecha,
      estado: "activo"
    })
    .eq("id", usuario_id);

  // Log
  await supabase.from("logs").insert({
    usuario_id,
    accion: `crear-licencia +${dias || 30} días`,
    fecha: new Date().toISOString()
  });

  return NextResponse.json({
    ok: true,
    nueva_expiracion: nuevaFecha
  });
}
