import { NextResponse } from "next/server";
import { supabase } from "../../../../../../lib/supabase";

export async function POST(req, { params }) {
  const { id } = params;

  const { data: user } = await supabase
    .from("usuarios")
    .select("email, fecha_expiracion")
    .eq("id", id)
    .limit(1);

  const fecha = new Date(user[0].fecha_expiracion);
  fecha.setDate(fecha.getDate() + 30);

  await supabase
    .from("usuarios")
    .update({ fecha_expiracion: fecha.toISOString() })
    .eq("id", id);

  await fetch("/api/admin/logs/registrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accion: "Licencia extendida +30 días",
      usuario_id: id,
      email: user[0].email,
    }),
  });

  return NextResponse.json({ ok: true });
}
