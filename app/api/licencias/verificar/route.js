// app/api/licencias/verificar/route.js
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req) {
  const url = new URL(req.url);
  const email_tekla = url.searchParams.get("email");
  const plugin_id = url.searchParams.get("plugin_id");

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

  if (error || !licencia) {
    return Response.json({ ok: false, motivo: "no_existe" });
  }

  // ------------------------------------------------------
  // 3. Estado bloqueado
  // ------------------------------------------------------
  if (licencia.estado === "bloqueada") {
    return Response.json({ ok: false, motivo: "bloqueada" });
  }

  // ------------------------------------------------------
  // 4. Chequear expiración de soporte ANUAL (si aplica)
  //    → Solo afecta al soporte, no a la licencia.
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
  // 5. Verificar activaciones restantes
  // ------------------------------------------------------
  const activaciones_restantes =
    licencia.max_activaciones - licencia.activaciones_usadas;

  if (activaciones_restantes <= 0) {
    return Response.json({ ok: false, motivo: "sin_activaciones" });
  }

  // ------------------------------------------------------
  // 6. Respuesta limpia para el plugin Tekla
  // ------------------------------------------------------
  return Response.json({
    ok: true,
    plugin_id: licencia.plugin_id,
    estado: licencia.estado, // "activa"
    activaciones_usadas: licencia.activaciones_usadas,
    max_activaciones: licencia.max_activaciones,
    soporte_activo,
    activaciones_restantes
  });
}