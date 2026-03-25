import { supabaseRoute } from "@/lib/supabaseRoute";

export async function GET() {
  const supabase = supabaseRoute();

  // Obtener usuario logueado
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return Response.json({ licencias: [] }, { status: 401 });
  }

  // Obtener todos los pagos del usuario
  const { data: pagos, error: pagosError } = await supabase
    .from("pagos")
    .select("id")
    .eq("user_id", user.id);

  if (pagosError || !pagos) {
    return Response.json({ licencias: [] });
  }

  if (pagos.length === 0) {
    return Response.json({ licencias: [] });
  }

  const pagoIds = pagos.map((p) => p.id);

  // Obtener licencias vinculadas a los pagos
  const { data: licencias, error: licError } = await supabase
    .from("licencias")
    .select("*")
    .in("pago_id", pagoIds)
    .order("fecha_creacion", { ascending: false });

  if (licError) {
    return Response.json({ licencias: [] });
  }

  return Response.json({ licencias });
}