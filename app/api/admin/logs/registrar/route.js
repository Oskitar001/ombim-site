// app/api/admin/logs/registrar/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  const { accion, usuario_id, email, hardwareId } = await req.json();

  // Obtener IP del request
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0";

  const { error } = await supabase.from("logs").insert({
    accion,
    usuario_id,
    email,
    hardwareId: hardwareId || null,
    ip,
    fecha: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message });
  }

  return NextResponse.json({ ok: true });
}
