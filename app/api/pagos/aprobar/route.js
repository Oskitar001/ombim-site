// app/api/pagos/aprobar/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";
import { enviarEmail } from "@/lib/email";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { pago_id } = await req.json();

  if (!pago_id) {
    return NextResponse.json({ error: "Falta pago_id" }, { status: 400 });
  }

  const { data: pago, error } = await supabaseAdmin
    .from("pagos")
    .select("*, licencias(*)")
    .eq("id", pago_id)
    .single();

  if (error || !pago) {
    return NextResponse.json({ error: "No se encontró el pago" }, { status: 404 });
  }

  // Aprobar pago
  await supabaseAdmin.from("pagos").update({ estado: "aprobado" }).eq("id", pago_id);

  // Activar licencias
  await supabaseAdmin
    .from("licencias")
    .update({ estado: "activa" })
    .eq("pago_id", pago_id);

  // Notificar usuario
  const { data: userRes } = await supabaseAdmin.auth.admin.getUserById(pago.user_id);
  const emailsTekla = pago.licencias.map((l) => l.email_tekla);

  const html = `
    <h3>Tus licencias han sido activadas</h3>
    ${emailsTekla.map((e) => `- ${e}<br>`).join("")}
  `;

  if (userRes?.user?.email) {
    await enviarEmail(userRes.user.email, "Licencias activadas", html);
  }

  return NextResponse.json({ ok: true });
}