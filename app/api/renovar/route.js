import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { token, hardware_id } = await req.json();

  const decoded = Buffer.from(token, "base64").toString();
  const [usuario_id] = decoded.split(":");

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

  if (!user || user.estado !== "activo") {
    return NextResponse.json({ ok: false, error: "Usuario inválido" });
  }

  // Actualizar última conexión
  await supabase
    .from("dispositivos")
    .update({ ultima_conexion: new Date() })
    .eq("usuario_id", usuario_id)
    .eq("hardware_id", hardware_id);

  // Guardar log
  await supabase.from("logs").insert({
    usuario_id,
    accion: "renovar",
    hardware_id
  });

  return NextResponse.json({ ok: true });
}
