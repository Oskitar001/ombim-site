// /app/api/facturacion/guardar-numero/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();

  const pago_id = body?.pago_id?.toString().trim();
  const numero_factura = body?.numero_factura?.toString().trim();

  if (!pago_id || !numero_factura) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  // ✔ Comprobar que el pago existe
  const { data: pago, error: pagoErr } = await supabaseAdmin
    .from("pagos")
    .select("id")
    .eq("id", pago_id)
    .single();

  if (pagoErr || !pago) {
    console.error("Pago no encontrado:", pagoErr);
    return NextResponse.json({ error: "pago_no_encontrado" }, { status: 404 });
  }

  // ✔ Actualizar número de factura
  const { error } = await supabaseAdmin
    .from("pagos")
    .update({ numero_factura })
    .eq("id", pago_id);

  if (error) {
    console.error("Error asignando número de factura:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}