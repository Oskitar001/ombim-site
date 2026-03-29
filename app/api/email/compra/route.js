import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import compraTemplate from "@/app/api/email/plantillas/compra";

export const runtime = "nodejs";

export async function POST(req) {
  const body = await req.json();
  const { pago_id } = body;

  if (!pago_id) {
    return NextResponse.json({ error: "faltan_datos" }, { status: 400 });
  }

  // 1. Cargar pago
  const { data: pago, error: pagoError } = await supabaseAdmin
    .from("pagos")
    .select("id, tipo, importe, cantidad_licencias, plugin_id, user_id")
    .eq("id", pago_id)
    .single();

  if (pagoError || !pago) {
    return NextResponse.json({ error: "pago_no_encontrado" }, { status: 404 });
  }

  // 2. Cargar plugin con precios
  const { data: plugin } = await supabaseAdmin
    .from("plugins")
    .select("nombre, precio, precio_anual, precio_completa")
    .eq("id", pago.plugin_id)
    .single();

  // 3. Cargar usuario
  const { data: usuario } = await supabaseAdmin
    .from("usuarios")
    .select("email, nombre")
    .eq("id", pago.user_id)
    .single();

  // 4. Cargar emails Tekla asociados
  const { data: emails } = await supabaseAdmin
    .from("pagos_emails")
    .select("email_tekla")
    .eq("pago_id", pago_id);

  const listaEmails = emails?.map(e => e.email_tekla) ?? [];

  // 5. Calcular precio unitario según tipo
  let precioUnitario = 0;

  if (pago.tipo === "anual") {
    precioUnitario = plugin.precio_anual > 0 ? plugin.precio_anual : 0;
  }

  if (pago.tipo === "completa") {
    if (plugin.precio_completa > 0) {
      precioUnitario = plugin.precio_completa;
    } else {
      precioUnitario = plugin.precio; // fallback si precio_completa es 0
    }
  }

  // 6. Total (ya viene en BD, pero lo recalculamos por seguridad)
  const total = precioUnitario * pago.cantidad_licencias;

  // 7. Renderizar email
  const html = compraTemplate({
    nombreUsuario: usuario.nombre,
    pluginNombre: plugin.nombre,
    tipo: pago.tipo,                // anual | completa
    precioUnitario,
    cantidad: pago.cantidad_licencias,
    total,
    emailsTekla: listaEmails
  });

  // 8. Enviar email
  await sendEmail({
    to: usuario.email,
    subject: "Confirmación de compra - OMBIM",
    html,
  });

  return NextResponse.json({ ok: true });
}