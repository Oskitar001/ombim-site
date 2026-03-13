import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { email, password, hardware_id } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );

  // Buscar usuario
  const { data: user, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Usuario no encontrado" });
  }

  if (user.estado !== "activo") {
    return NextResponse.json({ ok: false, error: "Usuario suspendido" });
  }

  // Validar contraseña en texto plano
  const valid = password === user.password_hash;
  if (!valid) {
    return NextResponse.json({ ok: false, error: "Contraseña incorrecta" });
  }

  // Contar dispositivos
  const { data: dispositivos } = await supabase
    .from("dispositivos")
    .select("*")
    .eq("usuario_id", user.id);

  const existe = dispositivos.find(d => d.hardware_id === hardware_id);

  if (!existe && dispositivos.length >= user.max_dispositivos) {
    return NextResponse.json({
      ok: false,
      error: "Límite de dispositivos alcanzado"
    });
  }

  // Registrar dispositivo si no existe
  if (!existe) {
    await supabase.from("dispositivos").insert({
      usuario_id: user.id,
      hardware_id
    });
  } else {
    // Actualizar última conexión
    await supabase
      .from("dispositivos")
      .update({ ultima_conexion: new Date() })
      .eq("id", existe.id);
  }

  // Crear token simple
  const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");

  // Guardar log
  await supabase.from("logs").insert({
    usuario_id: user.id,
    accion: "login",
    hardware_id
  });

  return NextResponse.json({
    ok: true,
    token,
    usuario_id: user.id
  });
}
