// /app/api/plugin/download/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req) {
  const supabase = await supabaseServer();

  // Usuario logueado
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return NextResponse.json({ error: "no_autenticado" }, { status: 401 });
  }

  const user_id = userData.user.id;

  // plugin_id seguro
  const plugin_id = new URL(req.url).searchParams.get("plugin_id")?.trim();
  if (!plugin_id) {
    return NextResponse.json({ error: "falta_plugin_id" }, { status: 400 });
  }

  // Obtener plugin con control de errores
  const { data: plugin, error: pluginError } = await supabaseAdmin
    .from("plugins")
    .select("archivo_url, precio")
    .eq("id", plugin_id)
    .single();

  if (pluginError || !plugin) {
    console.error("Error cargando plugin:", pluginError);
    return NextResponse.json({ error: "plugin_no_encontrado" }, { status: 404 });
  }

  // Licencia FULL (si existe)
  const { data: lic, error: licError } = await supabaseAdmin
    .from("licencias")
    .select("*")
    .eq("user_id", user_id)
    .eq("plugin_id", plugin_id)
    .eq("estado", "activa")
    .maybeSingle();

  if (licError) {
    console.error("Error buscando licencia:", licError);
  }

  let trial = true;

  if (lic) {
    if (lic.tipo === "completa") trial = false;

    if (lic.tipo === "anual" && lic.fecha_expiracion) {
      if (new Date(lic.fecha_expiracion) > new Date()) trial = false;
    }
  }

  // Rutas en bucket
  const filePath = trial
    ? `trial/${plugin_id}.tsep`
    : plugin.archivo_url;

  // Firmar URL con control de error
  const { data: signed, error: signedError } = await supabaseAdmin.storage
    .from("plugins")
    .createSignedUrl(filePath, 60);

  if (signedError || !signed?.signedUrl) {
    console.error("Error creando URL firmada:", signedError);
    return NextResponse.json({ error: "no_se_puede_firmar" }, { status: 500 });
  }

  // Registrar descarga (no crítico)
  const { error: dlError } = await supabase
    .from("descargas")
    .insert({
      user_id,
      plugin_id,
      fecha: new Date().toISOString()
    });

  if (dlError) {
    console.error("Error registrando descarga:", dlError);
  }

  // JSON o redirect
  const wantsJSON = req.headers.get("accept")?.includes("application/json");
  if (wantsJSON) {
    return NextResponse.json({
      ok: true,
      trial,
      url: signed.signedUrl
    });
  }

  return NextResponse.redirect(signed.signedUrl);
}