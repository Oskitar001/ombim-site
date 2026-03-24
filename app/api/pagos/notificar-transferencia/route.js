// app/api/pagos/notificar-transferencia/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { enviarEmail, plantillaTransferenciaNotificada } from "@/lib/email";

export async function POST(req) {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { pago_id } = await req.json();

  if (!pago_id) {
    return NextResponse.json({ error: "Falta pago_id" }, { status: 400 });
  }

  const { data: pago } = await supabase
    .from("pagos")
    .select("*, licencias(*)")
    .eq("id", pago_id)
    .single();

  if (!pago) {
    return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  // Actualizar estado del pago
  await supabase
    .from("pagos")
    .update({ estado: "transferencia_notificada" })
    .eq("id", pago_id);

  // Email al admin
  const html = plantillaTransferenciaNotificada(userData.user.email, pago);

  await enviarEmail(process.env.ADMIN_EMAIL, "Transferencia notificada", html);

  return NextResponse.json({ ok: true });
}