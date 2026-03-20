import { NextResponse } from "next/server";
import { requireAdmin } from "../../../_utils";

export async function POST(req, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json(auth, { status: auth.status });

  const { supabase } = auth;

  // 1. Marcar pago como aprobado
  await supabase
    .from("pagos")
    .update({ estado: "aprobado" })
    .eq("id", params.id);

  // 2. Activar licencias asociadas
  await supabase.rpc("activar_licencias_por_pago", { pago_id: params.id });

  return NextResponse.json({ ok: true });
}
