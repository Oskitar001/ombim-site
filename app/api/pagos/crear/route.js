import { supabaseRoute } from "@/lib/supabaseRoute";

export async function POST(req) {
  const supabase = supabaseRoute();

  // 1. Usuario real
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const { plugin_id, emails_tekla } = await req.json();

  // VALIDACIÓN
  if (!plugin_id || !emails_tekla?.length) {
    return Response.json({ error: "Datos incompletos" }, { status: 400 });
  }

  // 2. Crear el PAGO sin emails_tekla
  const { data: pago, error } = await supabase
    .from("pagos")
    .insert({
      user_id: user.id,
      plugin_id,
      cantidad_licencias: emails_tekla.length,
      estado: "pendiente",
      fecha: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return Response.json({ error }, { status: 500 });

  // 3. Crear LICENCIAS (una por email)
  const licencias = emails_tekla.map((email) => ({
    plugin_id,
    email_tekla: email,      // la asignación inicial
    estado: "trial",         // comienzan trial
    pago_id: pago.id,
    user_id: user.id,
    fecha_creacion: new Date().toISOString(),
    activaciones_usadas: 0,
    max_activaciones: 1
  }));

  const { error: licError } = await supabase
    .from("licencias")
    .insert(licencias);

  if (licError) {
    return Response.json({ error: licError }, { status: 500 });
  }

  return Response.json({ ok: true, pago });
}