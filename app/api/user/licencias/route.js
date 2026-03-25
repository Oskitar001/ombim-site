import { supabaseRoute } from "@/lib/supabaseRoute";

export async function GET() {
  const supabase = supabaseRoute();

  // Obtener usuario logueado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return Response.json({ licencias: [] }, { status: 401 });

  // Obtener licencias asociadas a pagos del usuario
  const { data: pagos } = await supabase
    .from("pagos")
    .select("id")
    .eq("user_id", user.id);

  if (!pagos || pagos.length === 0)
    return Response.json({ licencias: [] });

  const pagoIds = pagos.map((p) => p.id);

  const { data: licencias } = await supabase
    .from("licencias")
    .select("*")
    .in("pago_id", pagoIds)
    .order("fecha_creacion", { ascending: false });

  return Response.json({ licencias });
}