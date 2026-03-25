// app/api/pagos/create/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";

export async function POST(req) {
  const supabase = supabaseRoute();

  // Obtener usuario REAL
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const { plugin_id, emails_tekla } = await req.json();

  if (!plugin_id || !emails_tekla?.length) {
    return Response.json({ error: "Datos incompletos" }, { status: 400 });
  }

  // Crear pago seguro
  const { data, error } = await supabase
    .from("pagos")
    .insert({
      user_id: user.id,     // ← seguridad
      plugin_id,
      emails_tekla,
      cantidad_licencias: emails_tekla.length,
      estado: "pendiente",
      fecha: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return Response.json({ error }, { status: 500 });

  return Response.json({ ok: true, pago: data });
}