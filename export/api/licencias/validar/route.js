// /app/api/licencias/validar/route.js
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "json_invalido" });
  }

  // ✅ CAMBIO TOTAL
  const license_key = payload?.license_key?.trim()?.toUpperCase();
  const plugin_id = payload?.plugin_id;
  const maquina_id = payload?.maquina_id?.trim();

  if (!license_key || !plugin_id) {
    return NextResponse.json({ ok: false, error: "faltan_datos" });
  }

  // ✅ buscar por license_key
  const { data: lic, error } = await supabaseAdmin
    .from("licencias")
    .select("*")
    .eq("license_key", license_key)
    .eq("plugin_id", plugin_id)
    .maybeSingle();

  if (error || !lic) {
    return NextResponse.json({ ok: false, error: "no_existe" });
  }

  // bloqueada
  if (lic.estado === "bloqueada") {
    return NextResponse.json({ ok: false, error: "bloqueada" });
  }

  if (lic.estado === "pendiente") {
    return NextResponse.json({ ok: false, error: "pendiente" });
  }

  // expiración
  if (lic.fecha_expiracion) {
    const exp = new Date(lic.fecha_expiracion);
    if (exp < new Date()) {
      return NextResponse.json({ ok: false, error: "expirada" });
    }
  }

  // ✅ lógica nueva con máquinas
  const { data: maquinas } = await supabaseAdmin
    .from("licencias_maquinas")
    .select("maquina_id")
    .eq("licencia_id", lic.id);

  const maquinasIds = (maquinas ?? []).map((m) => m.maquina_id);
  const max = Number(lic.max_activaciones ?? 0);

  // ✅ máquina ya registrada
  if (maquina_id && maquinasIds.includes(maquina_id)) {
    return NextResponse.json({
      ok: true,
      estado: lic.estado,
      fecha_expiracion: lic.fecha_expiracion
    });
  }

  // ❌ sin slots
  if (maquinasIds.length >= max) {
    return NextResponse.json({ ok: false, error: "sin_activaciones" });
  }

  // ✅ registrar máquina
  const { error: insertErr } = await supabaseAdmin
    .from("licencias_maquinas")
    .insert({
      licencia_id: lic.id,
      maquina_id,
      fecha: new Date().toISOString()
    });

  if (insertErr) {
    return NextResponse.json({ ok: false, error: "error_actualizando" });
  }

  return NextResponse.json({
    ok: true,
    estado: lic.estado,
    fecha_expiracion: lic.fecha_expiracion
  });
}