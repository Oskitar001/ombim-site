// app/api/plugin/download/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req) {
  const supabase = await supabaseServer();

  // Usuario autenticado
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Obtener plugin_id
  const plugin_id = new URL(req.url).searchParams.get("plugin_id");
  if (!plugin_id) {
    return NextResponse.json({ error: "Falta plugin_id" }, { status: 400 });
  }

  // Obtener plugin
  const { data: plugin, error } = await supabaseAdmin
    .from("plugins")
    .select("archivo_url, precio")
    .eq("id", plugin_id)
    .single();

  if (error || !plugin?.archivo_url) {
    return NextResponse.json({ error: "Plugin no encontrado" }, { status: 404 });
  }

  // ¿Tiene el usuario un pago validado?
  const { data: pagoValido } = await supabase
    .from("pagos")
    .select("id")
    .eq("plugin_id", plugin_id)
    .eq("user_id", userData.user.id)
    .eq("estado", "validado")
    .maybeSingle();

  const esTrial = !pagoValido;

  // Registrar descarga
  await supabase.from("descargas").insert({
    user_id: userData.user.id,
    plugin_id,
    fecha: new Date().toISOString(),
  });

  // URL firmada segura desde STORAGE
  const { data: signed } = await supabaseAdmin.storage
    .from("plugins")
    .createSignedUrl(plugin.archivo_url, 60); // 60s

  if (!signed) {
    return NextResponse.json(
      { error: "No se pudo generar enlace seguro" },
      { status: 500 }
    );
  }

  // JSON si es fetch
  const wantsJSON = req.headers.get("accept")?.includes("application/json");

  if (wantsJSON) {
    return NextResponse.json({
      ok: true,
      trial: esTrial,
      mensaje: esTrial
        ? "Descarga en modo TRIAL registrada."
        : "Descarga completa registrada.",
      url: signed.signedUrl,
    });
  }

  // Navegación normal → redirigir al archivo firmado
  return NextResponse.redirect(signed.signedUrl);
}