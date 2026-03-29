// /app/api/pagos/detalle/[pago_id]/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req, context) {
  // Next.js 16 → params es promesa
  const { pago_id } = await context.params;

  const supabase = supabaseRoute();

  // ==========================================================
  // 1) Obtener el pago (sin comentarios en el select)
  // ==========================================================
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
      iva
    `)
    .eq("id", pago_id)
    .single();

  if (error || !pago) {
    console.log("❌ Error cargando pago:", error);
    return NextResponse.json(
      { error: "pago_no_encontrado" },
      { status: 404 }
    );
  }

  // ==========================================================
  // 2) Emails asociados
  // ==========================================================
  const { data: emails } = await supabase
    .from("pagos_emails")
    .select("email_tekla")
    .eq("pago_id", pago_id);

  // ==========================================================
  // 3) Respuesta final segura
  // ==========================================================
  return NextResponse.json({
    ...pago,
    emails: emails?.map(e => e.email_tekla) ?? [],
    importe_base: pago.importe_base ?? 0,
    iva: pago.iva ?? 0,
    importe: pago.importe ?? (pago.importe_base ?? 0) + (pago.iva ?? 0),
  });
}
