import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json();
  const { email_tekla, plugin_id, maquina_id } = body;

  if (!email_tekla || !plugin_id) {
    return NextResponse.json(
      { estado: "error", mensaje: "Datos incompletos" },
      { status: 400 }
    );
  }

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

  if (lic.estado === "bloqueada") {
    return NextResponse.json({ estado: "bloqueada" });
  }

  if (lic.fecha_expiracion && new Date(lic.fecha_expiracion) < new Date()) {
    return NextResponse.json({ estado: "expirada" });
  }

  if (lic.activaciones_usadas >= lic.max_activaciones) {
    return NextResponse.json({ estado: "sin_activaciones" });
  }

  // Incrementar activaciones
  await supabaseAdmin
    .from("licencias")
    .update({ activaciones_usadas: lic.activaciones_usadas + 1 })
    .eq("id", lic.id);

  return NextResponse.json({
    estado: lic.estado,
    activaciones_restantes: lic.max_activaciones - (lic.activaciones_usadas + 1),
    fecha_expiracion: lic.fecha_expiracion,
  });
}
