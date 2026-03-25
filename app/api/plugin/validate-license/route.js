// app/api/plugin/validate-license/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  let payload;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ estado: "error", mensaje: "json_invalido" });
  }

  const { email_tekla, plugin_id, maquina_id } = payload;

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
    .single();

  if (error || !lic) {
    return NextResponse.json({ estado: "sin_licencia" });
  }

  // bloqueada
  if (lic.estado === "bloqueada") {
    return NextResponse.json({ estado: "bloqueada" });
  }

  // trial expirado
  if (lic.fecha_expiracion) {
    if (new Date(lic.fecha_expiracion) < new Date()) {
      return NextResponse.json({ estado: "expirada" });
    }
  }

  // sin activaciones disponibles
  if (lic.activaciones_usadas >= lic.max_activaciones) {
    return NextResponse.json({ estado: "sin_activaciones" });
  }

  // registrar activación
  await supabaseAdmin
    .from("licencias")
    .update({
      activaciones_usadas: lic.activaciones_usadas + 1,
      maquina_id: maquina_id ?? lic.maquina_id
    })
    .eq("id", lic.id);

  return NextResponse.json({
    estado: lic.estado,
    activaciones_restantes:
      lic.max_activaciones - (lic.activaciones_usadas + 1),
    fecha_expiracion: lic.fecha_expiracion ?? null
  });
}