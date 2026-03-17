import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data } = await supabase
    .from("pagos")
    .select(`
      id,
      estado,
      fecha,
      user_id,
      plugin_id,
      users ( email ),
      plugins ( nombre )
    `)
    .order("fecha", { ascending: false });

  const pagos = data.map(p => ({
    id: p.id,
    estado: p.estado,
    fecha: p.fecha,
    user_email: p.users.email,
    plugin_nombre: p.plugins.nombre
  }));

  return NextResponse.json(pagos);
}
