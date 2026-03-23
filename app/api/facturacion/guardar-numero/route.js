import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  const supabase = await supabaseServer();
  const { pago_id, numero_factura } = await req.json();

  if (!pago_id || !numero_factura) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const { error } = await supabase
    .from("pagos")
    .update({ numero_factura })
    .eq("id", pago_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
