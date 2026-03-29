import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { sendEmail } from "@/lib/email";

export async function POST(req) {
  const supabase = await supabaseServer();

  // ================================
  // 1. Obtener usuario autenticado
  // ================================
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  // ================================
  // 2. Obtener datos de facturación
  // ================================
  const { data: fact } = await supabase
    .from("facturacion")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!fact) {
    return NextResponse.json(
      {
        error: "Sin datos de facturación",
        mensaje: "Debe completar su información de facturación antes de solicitar una factura."
      },
      { status: 400 }
    );
  }

  // ================================
  // 3. Datos enviados por el usuario
  // (p.ej: pago_id para el que quiere factura)
  // ================================
  const { pago_id } = await req.json();

  if (!pago_id) {
    return NextResponse.json(
      { error: "Falta pago_id" },
      { status: 400 }
    );
  }

  // ================================
  // 4. Enviar email al ADMIN
  // ================================
  const html = `
    <h2>Solicitud de factura</h2>

    <p><strong>Usuario:</strong> ${user.email}</p>
    <p><strong>Nombre usuario:</strong> ${user.user_metadata?.nombre ?? "—"}</p>
    <p><strong>Empresa:</strong> ${user.user_metadata?.empresa ?? "—"}</p>

    <h3>Datos de Facturación</h3>
    <p><strong>Razón social:</strong> ${fact.nombre}</p>
    <p><strong>NIF/CIF:</strong> ${fact.nif}</p>
    <p><strong>Dirección:</strong> ${fact.direccion}</p>
    <p><strong>Ciudad:</strong> ${fact.ciudad}</p>
    <p><strong>CP:</strong> ${fact.cp}</p>
    <p><strong>País:</strong> ${fact.pais}</p>
    <p><strong>Teléfono:</strong> ${fact.telefono}</p>

    <h3>Solicitud</h3>
    <p>El usuario solicita la factura del pago con ID:</p>
    <p><strong>${pago_id}</strong></p>
  `;

  await sendEmail({
    to: "facturacion@ombim.site",
    subject: `[OMBIM] Nueva solicitud de factura`,
    html,
  });

  // ================================
  // 5. Respuesta al usuario
  // ================================
  return NextResponse.json({
    ok: true,
    mensaje: "Solicitud enviada. El administrador la revisará.",
  });
}