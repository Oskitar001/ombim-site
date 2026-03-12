import { NextResponse } from "next/server";
import { supabase } from "../../../../../../lib/supabase";

export async function POST(req, { params }) {
  const { id } = params;

  const { data: user } = await supabase
    .from("usuarios")
    .select("email")
    .eq("id", id)
    .limit(1);

  await supabase
    .from("usuarios")
    .update({ estado: "suspendido" })
    .eq("id", id);

  await fetch("/api/admin/logs/registrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accion: "Usuario suspendido",
      usuario_id: id,
      email: user[0].email,
    }),
  });

  return NextResponse.json({ ok: true });
}
