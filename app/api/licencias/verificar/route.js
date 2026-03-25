// app/api/licencias/verificar/route.js
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req) {
  const url = new URL(req.url);
  const email_tekla = url.searchParams.get("email");
  const plugin_id = url.searchParams.get("plugin_id");

  if (!email_tekla) {
    return Response.json({ ok: false, motivo: "sin_email" });
  }

  if (!plugin_id) {
    return Response.json({ ok: false, motivo: "sin_plugin" });
  }

  // Buscar licencia concreta por email + plugin
  const { data: licencia, error } = await supabaseAdmin
    .from("licencias")
    .select("*")
    .eq("email_tekla", email_tekla)
    .eq("plugin_id", plugin_id)
    .order("fecha_creacion", { ascending: false })
    .limit(1)
    .single();

  if (error || !licencia) {
    return Response.json({ ok: false, motivo: "no_existe" });
  }

  // Estado bloqueado
  if (licencia.estado === "bloqueada") {
    return Response.json({ ok: false, motivo: "bloqueada" });
  }

  // Trial expirado
  if (licencia.estado === "trial" && licencia.activaciones_usadas >= 1) {
    return Response.json({ ok: false, motivo: "trial_expirado" });
  }

  // Respuesta limpia
  return Response.json({
    ok: true,
    plugin_id: licencia.plugin_id,
    estado: licencia.estado,
    activaciones_usadas: licencia.activaciones_usadas,
    max_activaciones: licencia.max_activaciones
  });
}