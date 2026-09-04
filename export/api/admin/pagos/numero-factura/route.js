// /app/api/admin/pagos/numero-factura/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json(admin, { status: 403 });
  }

  const { pago_id, numero_factura } = await req.json();

  if (!pago_id || !numero_factura) {
    return NextResponse.json(
      { ok: false, error: "faltan_datos" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("pagos")
    .update({
      numero_factura: numero_factura,
      factura_solicitada: false // ya atendido
    })
    .eq("id", pago_id);

  if (error) {
    return NextResponse.json(
      { ok: false, error: "error_guardando", detalle: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}