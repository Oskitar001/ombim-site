// /app/api/email/compra/route.js
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { PLANTILLA_COMPRA } from "@/app/api/email/plantillas/compra";

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

  // 4. Cargar emails Tekla asociados
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
    precioUnitario = plugin.precio_completa > 0 ? plugin.precio_completa : plugin.precio;
  }

  const total = precioUnitario * pago.cantidad_licencias;

  // 6. Cargar datos de empresa (✔ AQUÍ LA MEJORA)
  const { data: empresa } = await supabaseAdmin
    .from("empresa")
    .select("*")
    .eq("id", 1)
    .single();

  // Evitar fallos si faltan datos
  const empresaNombre = empresa?.nombre ?? "Tu empresa";
  const empresaCif = empresa?.cif ?? "";
  const empresaDireccion = empresa?.direccion ?? "";
  const empresaCiudad = empresa?.ciudad ?? "";
  const empresaCp = empresa?.cp ?? "";
  const empresaPais = empresa?.pais ?? "";
  const empresaTelefono = empresa?.telefono ?? "";
  const empresaEmail = empresa?.email ?? "";
  const empresaIban = empresa?.iban ?? "";
  const empresaLogo = empresa?.logo_url ?? "";

  // 7. Lista emails
  const listaEmailsHtml = listaEmails.map((e) => `- ${e}<br>`).join("");

  // 8. Construir HTML sustituyendo marcadores de la plantilla
  let html = PLANTILLA_COMPRA
    .replace("{{plugin_nombre}}", plugin.nombre)
    .replace("{{lista_emails}}", listaEmailsHtml)
    .replace("{{cuenta_banco}}", empresaIban)
    .replace("{{pago_id}}", pago_id)
    .replace("{{precio}}", total);

  // ✔ Nuevos datos de empresa añadidos (solo si los usas en tu plantilla)
  html = html
    .replace("{{empresa_nombre}}", empresaNombre)
    .replace("{{empresa_cif}}", empresaCif)
    .replace("{{empresa_direccion}}", empresaDireccion)
    .replace("{{empresa_ciudad}}", empresaCiudad)
    .replace("{{empresa_cp}}", empresaCp)
    .replace("{{empresa_pais}}", empresaPais)
    .replace("{{empresa_telefono}}", empresaTelefono)
    .replace("{{empresa_email}}", empresaEmail)
    .replace("{{empresa_logo}}", empresaLogo);

  // 9. Enviar email
  await sendEmail({
    to: usuario.email,
    subject: `Compra recibida – ${plugin.nombre}`,
    html,
  });

  return NextResponse.json({ ok: true });
}