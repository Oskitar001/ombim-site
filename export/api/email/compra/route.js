// /app/api/email/compra/route.js
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { PLANTILLA_COMPRA } from "@/app/api/email/plantillas/compra"; // ✔ IMPORT CORRECTO

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

  // 2. Cargar plugin
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

  // 4. Cargar emails tekla asociados
  const { data: emails } = await supabaseAdmin
    .from("pagos_emails")
    .select("email_tekla")
    .eq("pago_id", pago_id);

  const listaEmails = emails?.map((e) => e.email_tekla) ?? [];

  // 5. Calcular precio unitario
  let precioUnitario = 0;

  if (pago.tipo === "anual") {
    precioUnitario = plugin.precio_anual > 0 ? plugin.precio_anual : 0;
  }

  if (pago.tipo === "completa") {
    if (plugin.precio_completa > 0) {
      precioUnitario = plugin.precio_completa;
    } else {
      precioUnitario = plugin.precio; // fallback
    }
  }

  const total = precioUnitario * pago.cantidad_licencias;

  // 6. Generar HTML final sustituyendo marcadores
  const listaEmailsHtml = listaEmails
    .map((e) => `- ${e}<br>`)
    .join("");

  const html = PLANTILLA_COMPRA
    .replace("{{plugin_nombre}}", plugin.nombre)
    .replace("{{lista_emails}}", listaEmailsHtml)
    .replace("{{cuenta_banco}}", "ES00 0000 0000 0000 0000 0000")
    .replace("{{pago_id}}", pago_id)
    .replace("{{precio}}", total);

  // 7. Enviar email al usuario
  await sendEmail({
    to: usuario.email,
    subject: `Compra recibida – ${plugin.nombre}`,
    html,
  });

  return NextResponse.json({ ok: true });
}