// /app/api/plugin/validate-license/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  let payload;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ estado: "error", mensaje: "json_invalido" });
  }

  // Normalización segura
  const email_tekla = payload?.email_tekla?.trim()?.toLowerCase();
  const plugin_id = payload?.plugin_id;
  const maquina_id = payload?.maquina_id;

  if (!email_tekla || !plugin_id) {
    return NextResponse.json({
      estado: "error",
      mensaje: "Datos incompletos"
    });
  }

  // obtener licencia
  const { data: lic, error } = await supabaseAdmin
    .from("licencias")
    .select("*")
    .eq("email_tekla", email_tekla)
    .eq("plugin_id", plugin_id)
    .order("fecha_creacion", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !lic) {
    console.error("Error obteniendo licencia:", error);
    return NextResponse.json({ estado: "sin_licencia" });
  }

  // bloqueada
  if (lic.estado === "bloqueada") {
    return NextResponse.json({ estado: "bloqueada" });
  }

  // pendiente (EVITA activar licencias antes de validarlas)
  if (lic.estado === "pendiente") {
    return NextResponse.json({ estado: "pendiente" });
  }

  // trial or anual expirado
  if (lic.fecha_expiracion) {
    const exp = new Date(lic.fecha_expiracion);
    if (exp < new Date()) {
      return NextResponse.json({ estado: "expirada" });
    }
  }

  // sin activaciones
  const usadas = Number(lic.activaciones_usadas ?? 0);
  const max = Number(lic.max_activaciones ?? 0);

  if (usadas >= max) {
    return NextResponse.json({ estado: "sin_activaciones" });
  }

  // registrar activación
  const nuevas = usadas + 1;

  const { error: updateErr } = await supabaseAdmin
    .from("licencias")
    .update({
      activaciones_usadas: nuevas,
      maquina_id: maquina_id ?? lic.maquina_id
    })
    .eq("id", lic.id);

  if (updateErr) {
    console.error("Error actualizando licencia:", updateErr);
    return NextResponse.json({ estado: "error_actualizando" });
  }

  return NextResponse.json({
    estado: lic.estado,
    activaciones_restantes: max - nuevas,
    fecha_expiracion: lic.fecha_expiracion ?? null
  });
}