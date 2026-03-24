// app/api/pagos/detalle/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req) {
  const supabase = await supabaseServer();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const pago_id = new URL(req.url).searchParams.get("pago_id");

  if (!pago_id) {
    return NextResponse.json({ error: "Falta pago_id" }, { status: 400 });
  }

  const { data: pago, error } = await supabase
    .from("pagos")
    .select("*, licencias(*)")
    .eq("id", pago_id)
    .eq("user_id", userData.user.id)
    .single();

  if (error || !pago) {
    return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  const { data: facturacion } = await supabase
    .from("facturacion")
    .select("*")
    .eq("user_id", pago.user_id)
    .single();

  return NextResponse.json({ ...pago, facturacion: facturacion ?? null });
}