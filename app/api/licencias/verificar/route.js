// app/api/licencias/verificar/route.js
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req) {
  const url = new URL(req.url);

  // ✔ Normalizar email
  const email_raw = url.searchParams.get("email");
  const email_tekla = email_raw?.trim()?.toLowerCase();

  // ✔ Normalizar plugin_id
  const plugin_id = url.searchParams.get("plugin_id")?.trim();

  // ------------------------------------------------------
  // 1. Validaciones básicas
  // ------------------------------------------------------
  if (!email_tekla) {
    return Response.json({ ok: false, motivo: "sin_email" });
  }

  if (!plugin_id) {
    return Response.json({ ok: false, motivo: "sin_plugin" });
  }

  // ------------------------------------------------------
  // 2. Buscar la licencia más reciente (email + plugin)
  // ------------------------------------------------------
  const { data: licencia, error } = await supabaseAdmin
    .from("licencias")
    .select("*")
    .eq("email_tekla", email_tekla)
    .eq("plugin_id", plugin_id)
    .order("fecha_creacion", { ascending: false })
    .limit(1)
    .maybeSingle();

  // ✔ Controlar error real del SELECT
  if (error || !licencia) {
    console.error("Error consultando licencia:", error);
    return Response.json({ ok: false, motivo: "no_existe" });
  }

  // ------------------------------------------------------
  // 3. Estado bloqueado o pendiente
  // ------------------------------------------------------
  if (licencia.estado === "bloqueada") {
    return Response.json({ ok: false, motivo: "bloqueada" });
  }

  if (licencia.estado === "pendiente") {
    return Response.json({ ok: false, motivo: "pendiente" });
  }

  // ------------------------------------------------------
  // 4. Chequear expiración del soporte anual
  // ------------------------------------------------------
  let soporte_activo = true;

  if (licencia.fecha_soporte_hasta) {
    const ahora = Date.now();
    const finSoporte = new Date(licencia.fecha_soporte_hasta).getTime();

    if (ahora > finSoporte) {
      soporte_activo = false;
    }
  }

  // ------------------------------------------------------
  // 5. Verificar activaciones restantes (parse seguro)
  // ------------------------------------------------------
  const usadas = Number(licencia.activaciones_usadas ?? 0);
  const max = Number(licencia.max_activaciones ?? 0);

  const activaciones_restantes = max - usadas;

  if (activaciones_restantes <= 0) {
    return Response.json({ ok: false, motivo: "sin_activaciones" });
  }

  // ------------------------------------------------------
  // 6. Respuesta limpia para el plugin Tekla
  // ------------------------------------------------------
  return Response.json({
    ok: true,
    plugin_id: licencia.plugin_id,
    estado: licencia.estado,
    activaciones_usadas: usadas,
    max_activaciones: max,
    soporte_activo,
    activaciones_restantes
  });
}