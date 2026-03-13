// app/api/login/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { email, password, hardware_id } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // 1. Buscar usuario
  const { data: user } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Usuario no encontrado" });
  }

  // 2. Validar estado
  if (user.estado !== "activo") {
    return NextResponse.json({ ok: false, error: "Usuario suspendido" });
  }

  // 3. Validar contraseña en texto plano
  if (password !== user.password_hash) {
    return NextResponse.json({ ok: false, error: "Contraseña incorrecta" });
  }

  // 4. Validar expiración
  const hoy = new Date();
  const exp = new Date(user.fecha_expiracion);

  if (exp < hoy) {
    return NextResponse.json({ ok: false, error: "Licencia expirada" });
  }

  // 5. Obtener dispositivos del usuario
  const { data: dispositivos } = await supabase
    .from("dispositivos")
    .select("*")
    .eq("usuario_id", user.id);

  const existe = dispositivos.find(d => d.hardware_id === hardware_id);

  // 6. Validar límite de dispositivos
  if (!existe && dispositivos.length >= user.max_dispositivos) {
    return NextResponse.json({
      ok: false,
      error: "Límite de dispositivos alcanzado"
    });
  }

  // 7. Registrar o actualizar dispositivo
  if (!existe) {
    await supabase.from("dispositivos").insert({
      usuario_id: user.id,
      hardware_id,
      fecha_registro: new Date().toISOString(),
      ultima_conexion: new Date().toISOString()
    });
  } else {
    await supabase
      .from("dispositivos")
      .update({ ultima_conexion: new Date().toISOString() })
      .eq("id", existe.id);
  }

  // 8. Registrar log
  await supabase.from("logs").insert({
    usuario_id: user.id,
    accion: "login",
    hardware_id,
    fecha: new Date().toISOString()
  });

  // 9. Crear token simple
  const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");

  return NextResponse.json({
    ok: true,
    token,
    usuario_id: user.id,
    expiracion: user.fecha_expiracion,
    estado: user.estado
  });
}
