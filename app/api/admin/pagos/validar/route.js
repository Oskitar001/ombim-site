import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";
import { sendEmail } from "@/lib/email";

// ✅ NUEVO: GENERADOR DE KEY
function generarLicenseKey() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = () =>
    Array.from({ length: 4 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("");

  return `${part()}-${part()}-${part()}`;
}

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
        error: "faltan_datos"
      },
      { status: 400 }
    );
  }

  const { data: pago, error: pagoErr } = await supabaseAdmin
    .from("pagos")
    .select("*")
    .eq("id", pago_id)
    .single();

  if (pagoErr || !pago) {
    return NextResponse.json(
      { ok: false, error: "pago_no_encontrado" },
      { status: 404 }
    );
  }

  const tipo = pago.tipo;
  const ahora = new Date().toISOString();

  let maxActivaciones = 1;
  let fechaExp = null;

  if (tipo === "completa") {
    maxActivaciones = 5;
  }

  if (tipo === "anual") {
    const f = new Date();
    f.setFullYear(f.getFullYear() + 1);
    fechaExp = f.toISOString();
  }

  if (tipo === "trimestral") {
    const f = new Date();
    f.setMonth(f.getMonth() + 3);
    fechaExp = f.toISOString();
  }

  // ✅ CREAR LICENCIAS CON KEY
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

      // ✅ AQUÍ VA LA CLAVE
      license_key: generarLicenseKey(),
    });
  }

  const { error: licErr } = await supabaseAdmin
    .from("licencias")
    .insert(licenciasInsertar);

  if (licErr) {
    return NextResponse.json(
      { ok: false, error: "error_creando_licencias" },
      { status: 500 }
    );
  }

  await supabaseAdmin
    .from("pagos")
    .update({ estado: "aprobado", fecha_validacion: ahora })
    .eq("id", pago_id);

  const { data: usuario } = await supabaseAdmin
    .from("usuarios")
    .select("email, nombre")
    .eq("id", pago.user_id)
    .maybeSingle();

  if (usuario?.email) {
    await sendEmail({
      to: usuario.email,
      subject: "Licencias activadas",
      html: `<p>Tus licencias ya están disponibles en tu panel.</p>`
    });
  }

  return NextResponse.json({
    ok: true,
    mensaje: `Se han creado ${licenciasInsertar.length} licencias`
  });
}