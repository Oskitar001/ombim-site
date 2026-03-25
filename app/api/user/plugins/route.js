// app/api/user/plugins/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";

export async function GET() {
  const supabase = supabaseRoute();

  // Usuario logueado
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ plugins: [] }, { status: 401 });
  }

  // Plugins comprados (pagos validados)
  const { data: pagos } = await supabase
    .from("pagos")
    .select("plugin_id")
    .eq("user_id", user.id)
    .eq("estado", "validado");

  const pluginsComprados = pagos?.map((p) => p.plugin_id) ?? [];

  // Plugins gratis
  const { data: gratuitos } = await supabase
    .from("plugins")
    .select("id")
    .eq("precio", 0);

  const pluginsGratis = gratuitos?.map((p) => p.id) ?? [];

  // Lista final permitida
  const permitidos = [...new Set([...pluginsComprados, ...pluginsGratis])];

  if (permitidos.length === 0) {
    return Response.json({ plugins: [] });
  }

  // Recuperar datos
  const { data: plugins } = await supabase
    .from("plugins")
    .select("id, nombre, version")
    .in("id", permitidos);

  return Response.json({
    plugins: (plugins ?? []).map((p) => ({
      id: p.id,
      nombre: p.nombre,
      version: p.version,
      descargar_url: `/api/plugin/download?plugin_id=${p.id}`
    }))
  });
}