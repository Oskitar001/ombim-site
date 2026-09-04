import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin.ok)
    return NextResponse.json({ error: "no_autorizado" }, { status: 403 });

  const { pago_id } = await req.json();

  await supabaseAdmin
    .from("pagos")
    .update({ estado: "rechazado" })
    .eq("id", pago_id);

  return NextResponse.json({ ok: true });
}