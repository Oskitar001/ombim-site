// app/api/admin/pagos/validar/[id]/route.js
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function POST(req, { params }) {
  const pago_id = params.id;

  if (!pago_id) {
    return Response.json({ error: "Falta pago_id" }, { status: 400 });
  }

  // Obtener pago completo
  const { data: pago, error } = await supabaseAdmin
    .from("pagos")
    .select("*")
    .eq("id", pago_id)
    .single();

  if (error || !pago) {
    return Response.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  // Verificar emails Tekla
  if (!Array.isArray(pago.emails_tekla) || pago.emails_tekla.length === 0) {
    return Response.json(
      { error: "Este pago no tiene emails Tekla asignados" },
      { status: 400 }
    );
  }

  // Crear licencias
  const nuevasLicencias = pago.emails_tekla.map((email) => ({
    plugin_id: pago.plugin_id,
    email_tekla: email,
    estado: "activa", // activas directamente
    max_activaciones: 1,
    activaciones_usadas: 0,
    fecha_creacion: new Date().toISOString(),
    pago_id: pago.id,
    user_id: pago.user_id,
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

  // Marcar pago como validado
  await supabaseAdmin
    .from("pagos")
    .update({ estado: "validado" })
    .eq("id", pago_id);

  return Response.json({ ok: true });
}