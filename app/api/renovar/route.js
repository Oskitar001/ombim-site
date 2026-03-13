// app/api/renovar/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { token, hardware_id, dias } = await req.json();

  // 1. Decodificar token simple
  const decoded = Buffer.from(token, "base64").toString();
  const [usuario_id] = decoded.split(":");

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // 2. Buscar usuario
  const { data: user } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", usuario_id)
    .single();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Usuario inválido" });
  }

  // 3. Validar estado
  if (user.estado !== "activo") {
    return NextResponse.json({ ok: false, error: "Usuario suspendido" });
  }

  // 4. Validar que el dispositivo exista
  const { data: dispositivos } = await supabase
    .from("dispositivos")
    .select("*")
    .eq("usuario_id", usuario_id);

  const existe = dispositivos.find(d => d.hardware_id === hardware_id);

  if (!existe) {
    return NextResponse.json({ ok: false, error: "Dispositivo no registrado" });
  }

  // 5. Calcular nueva fecha de expiración
  const fechaActual = new Date(user.fecha_expiracion);
  fechaActual.setDate(fechaActual.getDate() + (dias || 30)); // por defecto 30 días
  const nuevaFecha = fechaActual.toISOString();

  // 6. Actualizar usuario con nueva expiración
  await supabase
    .from("usuarios")
    .update({ fecha_expiracion: nuevaFecha })
    .eq("id", usuario_id);

  // 7. Actualizar última conexión del dispositivo
  await supabase
    .from("dispositivos")
    .update({ ultima_conexion: new Date().toISOString() })
    .eq("id", existe.id);

  // 8. Registrar log
  await supabase.from("logs").insert({
    usuario_id,
    accion: "renovar",
    hardware_id,
    fecha: new Date().toISOString()
  });

  return NextResponse.json({
    ok: true,
    nueva_expiracion: nuevaFecha
  });
}
