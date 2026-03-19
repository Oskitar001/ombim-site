import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase
    .from("pagos")
    .select(`
      id,
      user_id,
      plugin_id,
      estado,
      cantidad,
      fecha,
      auth_users:auth.users!inner(email),
      plugin:plugins!inner(nombre)
    `);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const mapped = data.map((p) => ({
    id: p.id,
    estado: p.estado,
    cantidad: p.cantidad,
    fecha: p.fecha,
    user_email: p.auth_users.email,
    plugin_nombre: p.plugin.nombre,
  }));

  return NextResponse.json(mapped);
}
