import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { enviarEmail, plantillaTransferenciaNotificada } from "@/lib/email";

export async function POST(req) {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const { pago_id } = body;

  if (!pago_id) {
    return NextResponse.json({ error: "Falta pago_id" }, { status: 400 });
  }

  await supabase
    .from("pagos")
    .update({ estado: "transferencia_notificada" })
    .eq("id", pago_id);

  const html = plantillaTransferenciaNotificada(
    userData.user.email,
    pago_id
  );

  await enviarEmail(process.env.ADMIN_EMAIL, "Transferencia notificada", html);

  return NextResponse.json({ ok: true });
}
