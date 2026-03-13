// app/api/admin/forzar-logout/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { usuario_id } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // Eliminar todos los dispositivos
  await supabase
    .from("dispositivos")
    .delete()
    .eq("usuario_id", usuario_id);

  // Log
  await supabase.from("logs").insert({
    usuario_id,
    accion: "forzar-logout",
    fecha: new Date().toISOString()
  });

  return NextResponse.json({ ok: true });
}
