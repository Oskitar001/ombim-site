// /app/api/pagos/detalle/[pago_id]/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req, ctx) {
  // ✔ FIX Next.js 15/16 → params es una PROMESA
  const { pago_id } = await ctx.params;

  if (!pago_id) {
    return NextResponse.json(
      { error: "id_invalido" },
      { status: 400 }
    );
  }

  // ✔ FIX Next.js 16 — supabaseRoute es async
  const supabase = await supabaseRoute();

  // ----------------------------------------------
  // 1) Obtener datos del pago
  // ----------------------------------------------
  const { data: pago, error } = await supabase
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
    .eq("id", pago_id)
    .maybeSingle();

  if (error || !pago) {
    return NextResponse.json(
      { error: "pago_no_encontrado" },
      { status: 404 }
    );
  }

  // ----------------------------------------------
  // 2) Emails asociados
  // ----------------------------------------------
  const { data: emails } = await supabase
    .from("pagos_emails")
    .select("email_tekla")
    .eq("pago_id", pago_id);

  const listaEmails = Array.isArray(emails)
    ? emails.map((e) => e.email_tekla)
    : [];

  // ----------------------------------------------
  // 3) Respuesta final (manteniendo tu estructura)
  // ----------------------------------------------
  return NextResponse.json({
    ...pago,

    emails: listaEmails,

    importe_base: pago.importe_base ?? 0,
    iva: pago.iva ?? 0,
    importe:
      pago.importe ??
      (pago.importe_base ?? 0) + (pago.iva ?? 0),

    numero_factura: pago.numero_factura ?? null,
    factura_solicitada: pago.factura_solicitada ?? false,
  });
}
``