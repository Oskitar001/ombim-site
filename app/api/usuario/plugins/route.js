import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
  );

  // Usuario logueado
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Obtener pagos del usuario
  const { data: pagos } = await supabase
    .from("pagos")
    .select(`
      id,
      estado,
      plugin_id,
      plugins ( nombre, archivo_url ),
      claves_entregadas ( clave )
    `)
    .eq("user_id", user.id);

  const resultado = pagos.map(p => ({
    plugin_id: p.plugin_id,
    nombre: p.plugins.nombre,
    estado: p.estado,
    clave: p.claves_entregadas?.clave || null,
    archivo_url: p.plugins.archivo_url
  }));

  return NextResponse.json(resultado);
}
