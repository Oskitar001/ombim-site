// /app/api/pagos/validar/route.js
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const { pago_id, emails_tekla } = await req.json();

  // ⚠ FIX: asegurar que es array antes de usar .map
  if (!pago_id || !Array.isArray(emails_tekla) || emails_tekla.length === 0) {
    return Response.json({ error: "faltan_datos" }, { status: 400 });
  }

  // 1. Obtener pago
  const { data: pago, error: pagoError } = await supabaseAdmin
    .from("pagos")
    .select("*")
    .eq("id", pago_id)
    .single();

  if (pagoError || !pago) {
    return Response.json({ error: "pago_no_encontrado" }, { status: 404 });
  }

  // ⭐ Asegurar tipo válido
  if (!["anual", "completa"].includes(pago.tipo)) {
    return Response.json({ error: "tipo_invalido" }, { status: 400 });
  }

  // 2. Configuración
  const maxActivaciones = pago.tipo === "completa" ? 5 : 1;

  let fechaExp = null;
  if (pago.tipo === "anual") {
    const f = new Date();
    f.setFullYear(f.getFullYear() + 1);
    fechaExp = f.toISOString();
  }

  const ahora = new Date().toISOString();

  // 3. Crear licencias limpias
  const licencias = emails_tekla.map((email) => ({
    pago_id,
    plugin_id: pago.plugin_id,
    user_id: pago.user_id,

    // ⚠ FIX: normalización del email
    email_tekla: email.trim(),

    tipo: pago.tipo,
    estado: "activa",
    max_activaciones: maxActivaciones,
    activaciones_usadas: 0,
    fecha_creacion: ahora,
    fecha_expiracion: fechaExp,
  }));

  const { error: licenciasError } = await supabaseAdmin
    .from("licencias")
    .insert(licencias);

  if (licenciasError) {
    console.error("❌ Error creando licencias:", licenciasError);
    return Response.json(
      { error: "error_creando_licencias" },
      { status: 500 }
    );
  }

  // 4. Marcar pago como aprobado
  await supabaseAdmin
    .from("pagos")
    .update({ estado: "aprobado", fecha_validacion: ahora })
    .eq("id", pago_id);

  return Response.json({ ok: true });
}