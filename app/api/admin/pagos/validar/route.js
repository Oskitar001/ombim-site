// app/api/admin/pagos/validar/route.js
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const { pago_id } = await req.json();

  if (!pago_id) {
    return Response.json({ error: "Falta pago_id" }, { status: 400 });
  }

  const { data: pago, error } = await supabaseAdmin
    .from("pagos")
    .select("*")
    .eq("id", pago_id)
    .single();

  if (error || !pago) {
    return Response.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  if (!Array.isArray(pago.emails_tekla) || pago.emails_tekla.length === 0) {
    return Response.json(
      { error: "El pago no contiene emails Tekla" },
      { status: 400 }
    );
  }

  // Crear licencias
  const licencias = pago.emails_tekla.map((email) => ({
    plugin_id: pago.plugin_id,
    email_tekla: email,
    estado: "activa",
    max_activaciones: 1,
    activaciones_usadas: 0,
    fecha_creacion: new Date().toISOString(),
    pago_id: pago.id,
    user_id: pago.user_id,
  }));

  const { error: licError } = await supabaseAdmin
    .from("licencias")
    .insert(licencias);

  if (licError) {
    return Response.json({ error: "Error creando licencias" }, { status: 500 });
  }

  // Validar pago
  await supabaseAdmin
    .from("pagos")
    .update({ estado: "validado" })
    .eq("id", pago_id);

  return Response.json({ ok: true });
}