// app/api/user/pagos/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";

export async function GET() {
  const supabase = supabaseRoute();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ pagos: [] }, { status: 401 });
  }

  const { data } = await supabase
    .from("pagos")
    .select("id, plugin_id, cantidad_licencias, estado, fecha, plugins(nombre)")
    .eq("user_id", user.id)
    .order("fecha", { ascending: false });

  const pagos = (data ?? []).map((p) => ({
    id: p.id,
    plugin_id: p.plugin_id,
    plugin_nombre: p.plugins?.nombre ?? "",
    cantidad_licencias: p.cantidad_licencias,
    estado: p.estado,
    fecha: p.fecha,
  }));

  return Response.json({ pagos });
}