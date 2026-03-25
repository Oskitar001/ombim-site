import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const { pago_id } = await req.json();

  // 1. Obtener pago
  const { data: pago, error } = await supabaseAdmin
    .from("pagos")
    .select("*")
    .eq("id", pago_id)
    .single();

  if (error || !pago) {
    return Response.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  // 2. Crear licencias por cada email tekla
  const licencias = pago.emails_tekla.map(email => ({
    plugin_id: pago.plugin_id,
    email_tekla: email,
    estado: "activa",
    max_activaciones: 1,
    activaciones_usadas: 0,
    fecha_creacion: new Date().toISOString(),
    pago_id: pago_id
  }));

  const { error: licenciasError } = await supabaseAdmin
    .from("licencias")
    .insert(licencias);

  if (licenciasError) {
    return Response.json({ error: "Error creando licencias" }, { status: 500 });
  }

  // 3. Cambiar estado del pago
  await supabaseAdmin
    .from("pagos")
    .update({ estado: "validado" })
    .eq("id", pago_id);

  // 4. TODO: enviar email al usuario notificando activación

  return Response.json({ ok: true });
}