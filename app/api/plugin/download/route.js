import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req) {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const plugin_id = searchParams.get("plugin_id");

  if (!plugin_id) {
    return NextResponse.json({ error: "Falta plugin_id" }, { status: 400 });
  }

  const { data: plugin, error } = await supabaseAdmin
    .from("plugins")
    .select("archivo_url")
    .eq("id", plugin_id)
    .single();

  if (error || !plugin?.archivo_url) {
    return NextResponse.json({ error: "Plugin no encontrado" }, { status: 404 });
  }

  // Registrar descarga
  await supabase
    .from("descargas")
    .insert({
      user_id: userData.user.id,
      plugin_id,
    });

  // Redirigir al archivo (Supabase Storage, S3, etc.)
  return NextResponse.redirect(plugin.archivo_url);
}
