import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";
import { sendEmail } from "@/lib/email";

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

  const tipo = pago.tipo;
  const ahora = new Date().toISOString();

  // ✅ NUEVO: calcular configuración de licencia
  let maxActivaciones = 1;
  let fechaExp = null;

  if (tipo === "completa") {
    maxActivaciones = 5;
    fechaExp = null;
  }

  if (tipo === "anual") {
    maxActivaciones = 1;
    const f = new Date();
    f.setFullYear(f.getFullYear() + 1);
    fechaExp = f.toISOString();
  }

  if (tipo === "trimestral") {
    maxActivaciones = 1;
    const f = new Date();
    f.setMonth(f.getMonth() + 3);
    fechaExp = f.toISOString();
  }

  // ✅ NUEVO: generar licencias según cantidad
  const licenciasInsertar = [];

  for (let i = 0; i < pago.cantidad_licencias; i++) {
    licenciasInsertar.push({
      user_id: pago.user_id,
      pago_id,
      plugin_id: pago.plugin_id,
      tipo,
      estado: "activa",
      activaciones_usadas: 0,
      max_activaciones: maxActivaciones,
      fecha_creacion: ahora,
      fecha_expiracion: fechaExp,
    });
  }

  // Insertar licencias
  const { error: licErr } = await supabaseAdmin
    .from("licencias")
    .insert(licenciasInsertar);

  if (licErr) {
    return NextResponse.json(
      {
        ok: false,
        error: "error_creando_licencias",
        mensaje: "No se pudieron crear las licencias."
      },
      { status: 500 }
    );
  }

  // 4. Actualizar estado del pago
  await supabaseAdmin
    .from("pagos")
    .update({ estado: "aprobado", fecha_validacion: ahora })
    .eq("id", pago_id);

  // 5. Enviar email al usuario
  const { data: usuario } = await supabaseAdmin
    .from("usuarios")
    .select("email, nombre")
    .eq("id", pago.user_id)
    .maybeSingle();

  if (usuario?.email) {
    const subject = "Tus licencias ya han sido activadas";
    const html = `
      <h2>Licencias activadas ✔</h2>
      <p>Hola ${usuario.nombre ?? ""},</p>
      <p>Te confirmamos que tu compra ha sido validada.</p>
      <p>Ya tienes ${licenciasInsertar.length} licencia(s) activas en tu cuenta.</p>
      <p><a href="https://ombim.site/panel/user/licencias" target="_blank">Ver mis licencias</a></p>
      <p>Gracias por confiar en OMBIM.</p>
    `;

    await sendEmail({
      to: usuario.email,
      subject,
      html,
    });
  }

  // 6. Respuesta final
  return NextResponse.json({
    ok: true,
    mensaje: `Pago validado correctamente. Se han creado ${licenciasInsertar.length} licencia(s).`,
    detalle: {
      pago_id,
      tipo,
      licencias_creadas: licenciasInsertar.length
    }
  });
}