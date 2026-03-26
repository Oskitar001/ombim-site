import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req, context) {
  const { id } = await context.params;

  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json(admin, { status: 403 });
  }

  // 1) Obtener el pago y sus licencias
  const { data: pago, error: pagoError } = await supabaseAdmin
    .from("pagos")
    .select("*, licencias(*)")  
    .eq("id", id)
    .maybeSingle();

  if (pagoError) {
    console.error("SUPABASE ERROR (pago):", pagoError);
    return NextResponse.json({ error: "Error consultando BD" }, { status: 500 });
  }

  if (!pago) {
    return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  // 2) Obtener la facturación POR user_id del pago
  const { data: facturacion, error: factError } = await supabaseAdmin
    .from("facturacion")
    .select("*")
    .eq("user_id", pago.user_id)
    .maybeSingle();

  if (factError) {
    console.error("SUPABASE ERROR (facturacion):", factError);
  }

  return NextResponse.json({
    pago,
    facturacion: facturacion ?? null
  });
}
