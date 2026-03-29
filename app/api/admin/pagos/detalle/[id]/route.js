import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req, ctx) {
  // ✔ Next.js 15/16 → params es PROMESA
  const { id } = await ctx.params;

  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json(admin, { status: 403 });
  }

  // ==========================================================
  // 1. Obtener pago COMPLETO (todos los campos necesarios)
  // ==========================================================
  const { data: pago, error: pagoErr } = await supabaseAdmin
    .from("pagos")
    .select(`
      id,
      user_id,
      plugin_id,
      cantidad_licencias,
      estado,
      fecha,
      tipo,
      importe,
      importe_base,
      iva,
      numero_factura,
      factura_solicitada
    `)
    .eq("id", id)
    .maybeSingle();

  if (pagoErr || !pago) {
    return NextResponse.json(
      { error: "pago_no_encontrado" },
      { status: 404 }
    );
  }

  // ==========================================================
  // 2. Emails asociados
  // ==========================================================
  const { data: emailsRaw } = await supabaseAdmin
    .from("pagos_emails")
    .select("email_tekla")
    .eq("pago_id", id);

  const emails = emailsRaw?.map((e) => e.email_tekla) ?? [];

  // ==========================================================
  // 3. Obtener facturación del usuario
  // ==========================================================
  const { data: facturacion } = await supabaseAdmin
    .from("facturacion")
    .select("*")
    .eq("user_id", pago.user_id)
    .maybeSingle();

  // ==========================================================
  // 4. Respuesta completa para el panel admin
  // ==========================================================
  return NextResponse.json({
    pago: {
      ...pago,

      // Emails asociados
      emails,

      // Valores seguros
      importe_base: pago.importe_base ?? 0,
      iva: pago.iva ?? 0,
      importe:
        pago.importe ??
        (pago.importe_base ?? 0) + (pago.iva ?? 0),

      // NUEVO para facturas
      numero_factura: pago.numero_factura ?? null,
      factura_solicitada: pago.factura_solicitada ?? false,
    },

    facturacion,
  });
}