// app/api/admin/cambiar-email/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { usuario_id, nuevo_email } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // Verificar si el email ya existe
  const { data: existe } = await supabase
    .from("usuarios")
    .select("id")
    .eq("email", nuevo_email)
    .limit(1);

  if (existe?.length > 0) {
    return NextResponse.json({ ok: false, error: "El email ya está en uso" });
  }

  // Actualizar email
  await supabase
    .from("usuarios")
    .update({ email: nuevo_email })
    .eq("id", usuario_id);

  // Log
  await supabase.from("logs").insert({
    usuario_id,
    accion: `cambiar-email a ${nuevo_email}`,
    fecha: new Date().toISOString()
  });

  return NextResponse.json({ ok: true });
}
