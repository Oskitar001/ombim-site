// /app/api/pagos/detalle/[pago_id]/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req, context) {
  const { pago_id } = await context.params;

  const supabase = supabaseRoute();

  // Cargar pago según columnas reales de tu tabla
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
      importe
    `)
    .eq("id", pago_id)
    .single();

  if (error || !pago) {
    console.log("❌ Error cargando pago:", error);
    return NextResponse.json({ error: "pago_no_encontrado" }, { status: 404 });
  }

  // Emails asociados
  const { data: emails } = await supabase
    .from("pagos_emails")
    .select("email_tekla")
    .eq("pago_id", pago_id);

  return NextResponse.json({
    ...pago,
    emails: emails?.map((e) => e.email_tekla) ?? []
  });
}