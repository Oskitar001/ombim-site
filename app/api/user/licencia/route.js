// app/api/user/licencia/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";

export async function GET(req) {
  const supabase = supabaseRoute();
  const id = req.nextUrl.searchParams.get("id");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "no_auth" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("licencias")
    .select("id, email_tekla, plugin_id, estado, activaciones_usadas, max_activaciones, fecha_creacion, plugins(nombre)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  return Response.json({ licencia: data });
}