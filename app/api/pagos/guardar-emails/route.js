// app/api/pagos/guardar-emails/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  const supabase = await supabaseServer();
  const body = await req.json();

  const { pago_id, emails } = body;

  if (!pago_id || !emails?.length) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  for (const entry of emails) {
    await supabase
      .from("licencias")
      .update({ email_tekla: entry.email_tekla })
      .eq("id", entry.licencia_id)
      .eq("pago_id", pago_id);
  }

  return NextResponse.json({ ok: true });
}