// app/api/admin/cambiar-password/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { usuario_id, nueva_password } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // Actualizar contraseña en texto plano
  await supabase
    .from("usuarios")
    .update({ password_hash: nueva_password })
    .eq("id", usuario_id);

  // Log
  await supabase.from("logs").insert({
    usuario_id,
    accion: "cambiar-password",
    fecha: new Date().toISOString()
  });

  return NextResponse.json({ ok: true });
}
