import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const plugin_id = searchParams.get("plugin_id");

  if (!plugin_id) {
    return NextResponse.json({ error: "plugin_id requerido" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Obtener usuario logueado
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Buscar pago del usuario
  const { data: pago } = await supabase
    .from("pagos")
    .select("*")
    .eq("user_id", user.id)
    .eq("plugin_id", plugin_id)
    .single();

  if (!pago) {
    return NextResponse.json(null); // No ha pagado
  }

  // Buscar clave entregada (si existe)
  const { data: clave } = await supabase
    .from("claves_entregadas")
    .select("clave")
    .eq("user_id", user.id)
    .eq("plugin_id", plugin_id)
    .single();

  return NextResponse.json({
    estado: pago.estado,
    clave: clave?.clave || null
  });
}
