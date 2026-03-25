import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req) {
  const url = new URL(req.url);
  const email_tekla = url.searchParams.get("email");

  if (!email_tekla)
    return Response.json({ ok: false, motivo: "sin_email" });

  const { data: licencias } = await supabaseAdmin
    .from("licencias")
    .select("*")
    .eq("email_tekla", email_tekla);

  if (!licencias || licencias.length === 0)
    return Response.json({ ok: false, motivo: "no_existe" });

  const licencia = licencias[0];

  if (licencia.estado === "bloqueada")
    return Response.json({ ok: false, motivo: "bloqueada" });

  if (licencia.estado === "trial" && licencia.activaciones_usadas >= 1)
    return Response.json({ ok: false, motivo: "trial_expirado" });

  return Response.json({
    ok: true,
    plugin_id: licencia.plugin_id,
    estado: licencia.estado,
    activaciones_usadas: licencia.activaciones_usadas,
    max_activaciones: licencia.max_activaciones,
  });
}