// app/api/admin/suspender/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { usuario_id } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // Suspender usuario
  await supabase
    .from("usuarios")
    .update({ estado: "suspendido" })
    .eq("id", usuario_id);

  // Log
  await supabase.from("logs").insert({
    usuario_id,
    accion: "suspender",
    fecha: new Date().toISOString()
  });

  return NextResponse.json({ ok: true });
}
