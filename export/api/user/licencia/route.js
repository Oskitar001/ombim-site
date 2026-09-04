// /app/api/user/licencia/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";
import { NextResponse } from "next/server";

export async function GET(req) {
  const supabase = await supabaseRoute();

  const id = req.nextUrl.searchParams.get("id")?.trim();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "no_auth" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("licencias")
    .select(`
      id,
      plugin_id,
      tipo,
      estado,
      activaciones_usadas,
      max_activaciones,
      fecha_creacion,
      fecha_expiracion,
      license_key,
      plugins (nombre)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    console.error("Error obteniendo licencia:", error);
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const licencia = {
    id: data.id,
    plugin_id: data.plugin_id,
    plugin_nombre: data.plugins?.nombre ?? data.plugin_id,
    tipo: data.tipo,
    estado: data.estado,
    license_key: data.license_key,
    activaciones_usadas: data.activaciones_usadas,
    max_activaciones: data.max_activaciones,
    fecha_creacion: data.fecha_creacion,
    fecha_expiracion: data.fecha_expiracion,
  };

  return NextResponse.json({ licencia });
}