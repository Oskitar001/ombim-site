import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";

export async function POST(req) {
  const { accion, usuario_id, email, hardwareId } = await req.json();

  await supabase.from("logs").insert({
    accion,
    usuario_id,
    email,
    hardwareId: hardwareId || null,
    fecha: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
