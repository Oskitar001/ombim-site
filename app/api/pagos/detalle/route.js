import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req) {
  const supabase = await supabaseServer();
  const { searchParams } = new URL(req.url);
  const pago_id = searchParams.get("pago_id");

  if (!pago_id) {
    return NextResponse.json({ error: "Falta pago_id" }, { status: 400 });
  }

  const { data: pago, error } = await supabase
    .from("pagos")
    .select("*, licencias(*)")
    .eq("id", pago_id)
    .single();

  if (error || !pago) {
    return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  const { data: facturacion } = await supabase
    .from("facturacion")
    .select("*")
    .eq("user_id", pago.user_id)
    .single();

  return NextResponse.json({
    ...pago,
    facturacion: facturacion || null,
  });
}
