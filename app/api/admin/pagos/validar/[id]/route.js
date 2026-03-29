// /app/api/admin/pagos/validar/[id]/route.js
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req, { params }) {
  const { id } = params;

  // 1. Obtener pago
  const { data: pago, error: pagoErr } = await supabaseAdmin
    .from("pagos")
    .select("*")
    .eq("id", id)
    .single();

  if (pagoErr || !pago) {
    return NextResponse.json({ error: "pago_no_encontrado" }, { status: 404 });
  }

  // 2. Obtener emails asociados
  const { data: emails } = await supabaseAdmin
    .from("pagos_emails")
    .select("email_tekla")
    .eq("pago_id", id);

  const listaEmails = emails?.map((e) => e.email_tekla) ?? [];

  // 3. Obtener plugin con precios
  const { data: plugin } = await supabaseAdmin
    .from("plugins")
    .select("precio, precio_anual, precio_completa")
    .eq("id", pago.plugin_id)
    .single();

  // 4. Crear licencias según tipo
  const licencias = [];

  for (const email of listaEmails) {
    let fecha_expiracion = null;
    let activaciones_restantes = 0;

    // ⭐ LÓGICA SEGÚN TIPO
    if (pago.tipo === "anual") {
      // anual SIEMPRE expira en 1 año
      fecha_expiracion = new Date();
      fecha_expiracion.setFullYear(fecha_expiracion.getFullYear() + 1);

      activaciones_restantes = 1;
    }

    if (pago.tipo === "completa") {
      // completa → no expira, 5 activaciones
      fecha_expiracion = null;
      activaciones_restantes = 5;
    }

    licencias.push({
      user_id: pago.user_id,
      plugin_id: pago.plugin_id,
      email_tekla: email,
      tipo: pago.tipo,
      estado: "activa",
      activaciones_restantes,
      fecha_expiracion,
      creado_en: new Date(),
    });
  }

  // 5. Insertar licencias
  const { error: insertErr } = await supabaseAdmin
    .from("licencias")
    .insert(licencias);

  if (insertErr) {
    console.error(insertErr);
    return NextResponse.json({ error: "error_insertando_licencias" }, { status: 500 });
  }

  // 6. Marcar pago como validado
  await supabaseAdmin
    .from("pagos")
    .update({
      estado: "validado",
      fecha_validacion: new Date(),
    })
    .eq("id", id);

  return NextResponse.json({ ok: true });
}