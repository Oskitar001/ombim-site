import { supabaseRoute } from "@/lib/supabaseRoute";

export async function GET() {
  const supabase = supabaseRoute();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return Response.json({ pagos: [] }, { status: 401 });

  const { data } = await supabase
    .from("pagos")
    .select("*")
    .eq("user_id", user.id)
    .order("fecha", { ascending: false });

  return Response.json({ pagos: data || [] });
}