// app/api/admin/cambiar-max-dispositivos/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { usuario_id, max_dispositivos } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // Actualizar límite
  await supabase
    .from("usuarios")
    .update({ max_dispositivos })
    .eq("id", usuario_id);

  // Log
  await supabase.from("logs").insert({
    usuario_id,
    accion: `cambiar-max-dispositivos a ${max_dispositivos}`,
    fecha: new Date().toISOString()
  });

  return NextResponse.json({ ok: true });
}
