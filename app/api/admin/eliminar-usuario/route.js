// app/api/admin/eliminar-usuario/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { usuario_id } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // Eliminar dispositivos
  await supabase
    .from("dispositivos")
    .delete()
    .eq("usuario_id", usuario_id);

  // Eliminar logs
  await supabase
    .from("logs")
    .delete()
    .eq("usuario_id", usuario_id);

  // Eliminar usuario
  await supabase
    .from("usuarios")
    .delete()
    .eq("id", usuario_id);

  return NextResponse.json({ ok: true });
}
