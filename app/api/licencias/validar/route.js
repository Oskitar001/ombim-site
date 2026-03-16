import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const body = await req.json();
  const { email, password, plugin_id, hardware_id } = body;

  if (!email || !password || !hardware_id) {
    return NextResponse.json({
      ok: false,
      error: "Datos incompletos",
      token: null,
      usuario_id: null,
      dias_restantes: 0,
      estado: "error"
    });
  }

  // 1. Buscar usuario
  const { data: userData } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .single();

  if (!userData) {
    return NextResponse.json({
      ok: false,
      error: "Usuario no encontrado",
      token: null,
      usuario_id: null,
      dias_restantes: 0,
      estado: "error"
    });
  }

  // 2. Validar contraseña (texto plano)
  if (password !== userData.password) {
    return NextResponse.json({
      ok: false,
      error: "Contraseña incorrecta",
      token: null,
      usuario_id: null,
      dias_restantes: 0,
      estado: "error"
    });
  }

  // 3. Buscar licencia válida
  const { data: licencia } = await supabase
    .from("licencias")
    .select("*, licencia_tipos(nombre)")
    .eq("user_id", userData.id)
    .eq("estado", "activa")
    .or(`plugin_id.eq.${plugin_id},plugin_id.is.null`)
    .single();

  if (!licencia) {
    return NextResponse.json({
      ok: false,
      error: "No tienes licencia para este plugin",
      token: null,
      usuario_id: userData.id,
      dias_restantes: 0,
      estado: "sin_licencia"
    });
  }

  // 4. Comprobar expiración
  let dias_restantes = 9999;
  if (licencia.fecha_expiracion) {
    const hoy = new Date();
    const exp = new Date(licencia.fecha_expiracion);
    dias_restantes = Math.ceil((exp - hoy) / (1000 * 60 * 60 * 24));

    if (dias_restantes <= 0) {
      return NextResponse.json({
        ok: false,
        error: "Licencia expirada",
        token: null,
        usuario_id: userData.id,
        dias_restantes: 0,
        estado: "expirada"
      });
    }
  }

  // 5. Comprobar activaciones
  const { data: activaciones } = await supabase
    .from("licencia_activaciones")
    .select("*")
    .eq("licencia_id", licencia.id);

  const yaActivado = activaciones.some(a => a.hardware_id === hardware_id);

  if (!yaActivado) {
    if (activaciones.length >= licencia.max_activaciones) {
      return NextResponse.json({
        ok: false,
        error: "Has alcanzado el máximo de equipos permitidos",
        token: null,
        usuario_id: userData.id,
        dias_restantes,
        estado: "limite_equipos"
      });
    }

    await supabase.from("licencia_activaciones").insert({
      licencia_id: licencia.id,
      hardware_id
    });
  }

  // 6. Generar token simple
  const token = crypto.randomUUID();

  return NextResponse.json({
    ok: true,
    error: null,
    token,
    usuario_id: userData.id,
    dias_restantes,
    estado: licencia.estado
  });
}
