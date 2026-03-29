import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "No autorizado",
        mensaje: "Solo administradores pueden validar pagos."
      },
      { status: 403 }
    );
  }

  const { pago_id } = await req.json();
  if (!pago_id) {
    return NextResponse.json(
      {
        ok: false,
        error: "faltan_datos",
        mensaje: "Debes enviar el ID del pago."
      },
      { status: 400 }
    );
  }

  // 1. Obtener pago
  const { data: pago, error: pagoErr } = await supabaseAdmin
    .from("pagos")
    .select("*")
    .eq("id", pago_id)
    .single();

  if (pagoErr || !pago) {
    return NextResponse.json(
      {
        ok: false,
        error: "pago_no_encontrado",
        mensaje: "El pago no existe en la base de datos."
      },
      { status: 404 }
    );
  }

  // 2. Obtener emails asociados
  const { data: emails, error: emailsErr } = await supabaseAdmin
    .from("pagos_emails")
    .select("email_tekla")
    .eq("pago_id", pago_id);

  if (emailsErr) {
    return NextResponse.json(
      {
        ok: false,
        error: "error_emails",
        mensaje: "No se pudieron obtener los emails asociados al pago."
      },
      { status: 500 }
    );
  }

  const emailsTekla = emails?.map((e) => e.email_tekla) ?? [];

  if (emailsTekla.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "no_hay_emails",
        mensaje: "Este pago no tiene emails Tekla, no se puede validar."
      },
      { status: 400 }
    );
  }

  // 3. Crear licencias (pero antes verificar duplicados)
  const ahora = new Date().toISOString();
  const tipo = pago.tipo;

  const maxActivaciones = tipo === "completa" ? 5 : 1;
  let fechaExp = null;

  if (tipo === "anual") {
    const f = new Date();
    f.setFullYear(f.getFullYear() + 1);
    fechaExp = f.toISOString();
  }

  const licenciasInsertar = [];

  for (const email of emailsTekla) {
    // 3.1 Verificar si YA existe una licencia activa para el mismo plugin + email
    const { data: existente } = await supabaseAdmin
      .from("licencias")
      .select("id")
      .eq("plugin_id", pago.plugin_id)
      .eq("email_tekla", email)
      .maybeSingle();

    if (existente) {
      return NextResponse.json(
        {
          ok: false,
          error: "licencia_existente",
          mensaje: `El email ${email} ya tiene una licencia para este plugin. No se puede validar este pago.`,
        },
        { status: 400 }
      );
    }

    // 3.2 Agregar a la lista para insertar
    licenciasInsertar.push({
      user_id: pago.user_id,
      pago_id,
      plugin_id: pago.plugin_id,
      email_tekla: email,
      tipo,
      estado: "activa",
      activaciones_usadas: 0,
      max_activaciones: maxActivaciones,
      fecha_creacion: ahora,
      fecha_expiracion: fechaExp,
    });
  }

  // 3.3 Insertar licencias
  const { error: licErr } = await supabaseAdmin
    .from("licencias")
    .insert(licenciasInsertar);

  if (licErr) {
    return NextResponse.json(
      {
        ok: false,
        error: "error_creando_licencias",
        mensaje: "No se pudieron crear las licencias. Revisa los datos."
      },
      { status: 500 }
    );
  }

  // 4. Actualizar estado del pago
  await supabaseAdmin
    .from("pagos")
    .update({ estado: "aprobado", fecha_validacion: ahora })
    .eq("id", pago_id);

  // 5. Respuesta bonita
  return NextResponse.json({
    ok: true,
    mensaje: `Pago validado correctamente. Se han creado ${licenciasInsertar.length} licencia(s).`,
    detalle: {
      pago_id,
      tipo,
      licencias_creadas: licenciasInsertar.length,
      emails: emailsTekla
    }
  });
}