// app/api/facturacion/guardar-numero/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { pago_id, numero_factura } = await req.json();

  if (!pago_id || !numero_factura) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("pagos")
    .update({ numero_factura })
    .eq("id", pago_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}