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

  // Seguridad
  if (!pago.emails_tekla || pago.emails_tekla.length === 0) {
    return Response.json(
      { error: "El pago no contiene emails Tekla" },
      { status: 400 }
    );
  }

  // 2. Crear licencias automáticamente
  const nuevasLicencias = pago.emails_tekla.map((email) => ({
    plugin_id: pago.plugin_id,
    email_tekla: email,
    estado: "activa",
    max_activaciones: 1,
    activaciones_usadas: 0,
    fecha_creacion: new Date().toISOString(),
    pago_id: pago.id,
  }));

  const { error: licError } = await supabaseAdmin
    .from("licencias")
    .insert(nuevasLicencias);

  if (licError) {
    return Response.json({ error: "Error creando licencias" }, { status: 500 });
  }

  // 3. Cambiar estado del pago a VALIDADO
  await supabaseAdmin
    .from("pagos")
    .update({ estado: "validado" })
    .eq("id", pago_id);

  // 4. Enviar email al usuario
  await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email/licencias/activadas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: pago.user_email,
      emails_tekla: pago.emails_tekla,
    }),
  });

  return Response.json({ ok: true });
}