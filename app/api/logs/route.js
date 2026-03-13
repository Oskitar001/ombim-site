import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { usuario_id, accion, hardware_id } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  await supabase.from("logs").insert({
    usuario_id,
    accion,
    hardware_id
  });

  return NextResponse.json({ ok: true });
}
