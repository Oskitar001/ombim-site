import { supabaseRoute } from "@/lib/supabaseRoute";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req, context) {
  // ⭐ FIX DEFINITIVO: params es Promesa y se llama pago_id
  const { pago_id } = await context.params;

  const supabase = supabaseRoute();

  // 1. Buscar el pago
  const { data: pago, error } = await supabase
    .from("pagos")
    .select(
      `
        id,
        user_id,
        plugin_id,
        importe,
        tipo,
        cantidad_licencias,
        estado,
        created_at,
        fecha_validacion
      `
    )
    .eq("id", pago_id)
    .single();

  if (error || !pago) {
    return NextResponse.json(
      { error: "pago_no_encontrado" },
      { status: 404 }
    );
  }

  // 2. Emails asociados al pago
  const { data: emails } = await supabase
    .from("pagos_emails")
    .select("email_tekla")
    .eq("pago_id", pago_id);

  return NextResponse.json({
    ...pago,
    emails: emails?.map((e) => e.email_tekla) ?? [],
  });
}
