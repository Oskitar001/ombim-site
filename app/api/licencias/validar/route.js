// app/api/licencias/validar/route.js
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  // ============================
  // 1. Validar payload
  // ============================
  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "payload_invalido" });
  }

  const { email_tekla, plugin_id, hardware_id } = payload;

  if (!email_tekla || !plugin_id || !hardware_id) {
    return NextResponse.json({ ok: false, error: "faltan_datos" });
  }

  // ============================
  // 2. Rate limit por IP
  // ============================
  const ip = req.headers.get("x-forwarded-for") ?? "0.0.0.0";
  const key = `rate_${ip}`;

  const rate = globalThis[key] ?? { count: 0, time: Date.now() };
  if (Date.now() - rate.time > 60000) {
    rate.count = 0;
    rate.time = Date.now();
  }
  rate.count++;
  globalThis[key] = rate;

  if (rate.count > 30) {
    return NextResponse.json({ ok: false, error: "rate_limit" });
  }

  // ============================
  // 3. Buscar licencia
  // ============================
  const { data: licencia, error: licError } = await supabaseAdmin
    .from("licencias")
    .select("*")
    .eq("email_tekla", email_tekla)
    .eq("plugin_id", plugin_id)
    .single();

  if (licError || !licencia) {
    return NextResponse.json({ ok: false, error: "no_existe" });
  }

  // ============================
  // 4. Licencia bloqueada
  // ============================
  if (licencia.estado === "bloqueada") {
    return NextResponse.json({ ok: false, error: "bloqueada" });
  }

  // ============================
  // 5. Trial expirado por activaciones
  // ============================
  if (licencia.estado === "trial" && licencia.activaciones_usadas >= 1) {
    return NextResponse.json({ ok: false, error: "trial_expirado" });
  }

  // ============================
  // 6. Primera activación → guardar hardware_id
  // ============================
  if (!licencia.hardware_id) {
    const { error: hardwareError } = await supabaseAdmin
      .from("licencias")
      .update({ hardware_id })
      .eq("id", licencia.id);

    if (hardwareError) {
      return NextResponse.json({ ok: false, error: "error_guardar_hardware" });
    }

    // Actualizar objeto local en memoria
    licencia.hardware_id = hardware_id;
  }

  // ============================
  // 7. Hardware diferente → sharing detectado
  // ============================
  if (licencia.hardware_id && licencia.hardware_id !== hardware_id) {
    return NextResponse.json({ ok: false, error: "hardware_diferente" });
  }

  // ============================
  // 8. Incrementar activaciones
  // ============================
  const nuevasActivaciones = licencia.activaciones_usadas + 1;

  const { error: activacionError } = await supabaseAdmin
    .from("licencias")
    .update({
      activaciones_usadas: nuevasActivaciones,
      ultima_activacion: new Date().toISOString()
    })
    .eq("id", licencia.id);

  if (activacionError) {
    return NextResponse.json({ ok: false, error: "error_activacion" });
  }

  // ============================
  // 9. Respuesta final (DTO limpio)
  // ============================
  return NextResponse.json({
    ok: true,
    licencia: {
      estado: licencia.estado,
      activaciones_usadas: nuevasActivaciones,
      max_activaciones: licencia.max_activaciones
      // NOTA: no devolvemos fecha_expiracion porque no existe en tu BD
    }
  });
}