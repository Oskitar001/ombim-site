// app/api/admin/dispositivos/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("dispositivos")
    .select(`
      id,
      usuario_id,
      hwid,
      ip,
      fecha_registro,
      ultima_conexion,
      usuarios (
        email,
        estado,
        fecha_expiracion
      )
    `)
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message });
  }

  return NextResponse.json({ ok: true, dispositivos: data });
}
