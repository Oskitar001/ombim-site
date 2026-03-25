import { supabaseRoute } from "@/lib/supabaseRoute";

export async function GET() {
  const supabase = supabaseRoute();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return Response.json({ plugins: [] });

  const { data } = await supabase
    .from("plugins")
    .select("id, nombre, version, url_descarga");

  return Response.json({ plugins: data || [] });
}