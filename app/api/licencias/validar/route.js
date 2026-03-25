import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  let payload = null;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "payload_invalido" });
  }

  const { email_tekla, plugin_id, hardware_id } = payload;

  if (!email_tekla || !plugin_id || !hardware_id) {
    return NextResponse.json({ ok: false, error: "faltan_datos" });
  }

  // RATE LIMIT simple por IP
  const ip = req.headers.get("x-forwarded-for") || "0.0.0.0";
  const key = `rate_${ip}`;
  const rate = globalThis[key] || { count: 0, time: Date.now() };

  if (Date.now() - rate.time > 60000) {
    rate.count = 0;
    rate.time = Date.now();
  }
  rate.count++;
  globalThis[key] = rate;

  if (rate.count > 30) {
    return NextResponse.json({ ok: false, error: "rate_limit" });
  }

  // Buscar licencia
  const { data: licencia } = await supabaseAdmin
    .from("licencias")
    .select("*")
    .eq("email_tekla", email_tekla)
    .eq("plugin_id", plugin_id)
    .single();

  if (!licencia) {
    return NextResponse.json({ ok: false, error: "no_existe" });
  }

  // Estado bloqueado
  if (licencia.estado === "bloqueada") {
    return NextResponse.json({ ok: false, error: "bloqueada" });
  }

  // Trial usado
  if (licencia.estado === "trial" && licencia.activaciones_usadas >= 1) {
    return NextResponse.json({ ok: false, error: "trial_expirado" });
  }

  // Primera activación → guardar hardware
  if (!licencia.hardware_id) {
    await supabaseAdmin
      .from("licencias")
      .update({ hardware_id })
      .eq("id", licencia.id);
  }

  // Diferente hardware → bloqueo anti‑sharing
  if (licencia.hardware_id && licencia.hardware_id !== hardware_id) {
    return NextResponse.json({ ok: false, error: "hardware_diferente" });
  }

  // Update activaciones
  await supabaseAdmin
    .from("licencias")
    .update({
      activaciones_usadas: licencia.activaciones_usadas + 1,
      ultima_activacion: new Date().toISOString(),
    })
    .eq("id", licencia.id);

  // Respuesta segura
  return NextResponse.json({
    ok: true,
    licencia: {
      estado: licencia.estado,
      fecha_expiracion: licencia.fecha_expiracion,
    },
  });
}