// app/api/user/licencias/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";

export async function GET() {
  const supabase = supabaseRoute();

  // Usuario logueado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ licencias: [] }, { status: 401 });
  }

  // Licencias del usuario
  const { data, error } = await supabase
    .from("licencias")
    .select("id, email_tekla, plugin_id, estado, activaciones_usadas, max_activaciones, fecha_creacion, plugins(nombre)")
    .eq("user_id", user.id)
    .order("fecha_creacion", { ascending: false });

  if (error || !data) {
    return Response.json({ licencias: [] });
  }

  const licencias = data.map((l) => ({
    id: l.id,
    email_tekla: l.email_tekla,
    plugin_id: l.plugin_id,
    plugin_nombre: l.plugins?.nombre ?? "",
    estado: l.estado,
    activaciones_usadas: l.activaciones_usadas,
    max_activaciones: l.max_activaciones,
    fecha_creacion: l.fecha_creacion,
  }));

  return Response.json({ licencias });
}
