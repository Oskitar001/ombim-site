import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function POST(req, { params }) {
  const pago_id = params.id;

  // 1. Obtener pago
  const { data: pago, error } = await supabaseAdmin
    .from("pagos")
    .select("*")
    .eq("id", pago_id)
    .single();

  if (error || !pago) {
    return Response.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  // Validación: pago sin emails Tekla
  if (!Array.isArray(pago.emails_tekla) || pago.emails_tekla.length === 0) {
    return Response.json(
      { error: "Este pago no tiene emails Tekla asignados" },
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
    pago_id: pago_id,
  }));

  const { error: licError } = await supabaseAdmin
    .from("licencias")
    .insert(nuevasLicencias);

  if (licError) {
    return Response.json(
      { error: "No se pudieron crear las licencias" },
      { status: 500 }
    );
  }

  // 3. Actualizar estado del pago
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