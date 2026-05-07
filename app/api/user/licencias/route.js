// /app/api/user/licencias/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await supabaseRoute();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ licencias: [] }, { status: 401 });
  }

  // ✅ 1. Licencias SIN join
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
      license_key
    `)
    .eq("user_id", user.id)
    .order("fecha_creacion", { ascending: false });

  if (error || !data) {
    console.error("Error obteniendo licencias:", error);
    return NextResponse.json({ licencias: [] });
  }

  // ✅ 2. IDs únicos de plugins
  const pluginIds = [...new Set(data.map(l => l.plugin_id))];

  // ✅ 3. Obtener nombres de plugins
  const { data: plugins } = await supabase
    .from("plugins")
    .select("id, nombre")
    .in("id", pluginIds);

  // ✅ 4. Unir manualmente
  const licencias = data.map((l) => ({
    id: l.id,
    plugin_id: l.plugin_id,
    plugin_nombre:
      plugins?.find(p => p.id === l.plugin_id)?.nombre ?? l.plugin_id,
    tipo: l.tipo,
    estado: l.estado,
    license_key: l.license_key,
    activaciones_usadas: l.activaciones_usadas,
    max_activaciones: l.max_activaciones,
    fecha_creacion: l.fecha_creacion,
    fecha_expiracion: l.fecha_expiracion,
  }));

  return NextResponse.json({ licencias });
}
