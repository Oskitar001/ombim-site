import { NextResponse } from "next/server";
import { requireAdmin } from "../../_utils";

export async function GET(_req, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json(auth, { status: auth.status });

  const { supabase } = auth;

  const { data } = await supabase
    .from("pagos")
    .select("*, licencias(*), facturacion(*)")
    .eq("id", params.id)
    .single();

  return NextResponse.json({ pago: data });
}
