// /app/api/user/plugins/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";
import { NextResponse } from "next/server";

export async function GET() {
  // ✔ FIX: supabaseRoute es async en Next 16
  const supabase = await supabaseRoute();

  // Usuario logueado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ plugins: [] }, { status: 401 });
  }

  // ✔ FIX: "validado" no existe en tu BBDD → debe ser "aprobado"
  const { data: pagos, error: pagosError } = await supabase
    .from("pagos")
    .select("plugin_id")
    .eq("user_id", user.id)
    .eq("estado", "aprobado");

  if (pagosError) {
    console.error("Error cargando pagos:", pagosError);
  }

  const pluginsComprados = pagos?.map((p) => p.plugin_id) ?? [];

  // Plugins gratis
  const { data: gratuitos, error: gratisError } = await supabase
    .from("plugins")
    .select("id")
    .eq("precio", 0);

  if (gratisError) {
    console.error("Error cargando plugins gratis:", gratisError);
  }

  const pluginsGratis = gratuitos?.map((p) => p.id) ?? [];

  // Lista final permitida
  const permitidos = [...new Set([...pluginsComprados, ...pluginsGratis])];

  if (permitidos.length === 0) {
    return NextResponse.json({ plugins: [] });
  }

  // Recuperar datos de plugins permitidos
  const { data: plugins, error: pluginsError } = await supabase
    .from("plugins")
    .select("id, nombre, version")
    .in("id", permitidos);

  if (pluginsError) {
    console.error("Error cargando plugins:", pluginsError);
    return NextResponse.json({ plugins: [] });
  }

  return NextResponse.json({
    plugins: (plugins ?? []).map((p) => ({
      id: p.id,
      nombre: p.nombre,
      version: p.version,
      descargar_url: `/api/plugin/download?plugin_id=${p.id}`,
    })),
  });
}