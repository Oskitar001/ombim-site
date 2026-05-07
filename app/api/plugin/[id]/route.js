import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req, context) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "id_faltante" }, { status: 400 });
  }

 const { data, error } = await supabaseAdmin
  .from("plugins")
  .select(`
    id,
    nombre,
    descripcion,
    precio,
    precio_trimestral,
    precio_anual,
    precio_completa,
    permite_trimestral,
    permite_anual,
    permite_completa,
    archivo_url,
    video_url,
    imagen_url,
    version
  `)
  .eq("id", id)
  .maybeSingle();


 if (error) {
  console.error("❌ ERROR REAL:", error);
  return NextResponse.json({ error: error.message }, { status: 500 });
}


  if (!data) {
    return NextResponse.json({ error: "plugin_no_encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    ...data,
    precio: data.precio ?? 0,
    precio_trimestral: data.precio_trimestral ?? 0,   // ✅ AÑADIDO
    precio_anual: data.precio_anual ?? 0,
    precio_completa: data.precio_completa ?? 0,
    permite_trimestral: data.permite_trimestral ?? false, // ✅ AÑADIDO
    permite_anual: data.permite_anual ?? false,           // ✅ AÑADIDO
    permite_completa: data.permite_completa ?? false,     // ✅ AÑADIDO
    archivo_url: data.archivo_url ?? "",
    video_url: data.video_url ?? "",
    imagen_url: data.imagen_url ?? "",
    descripcion: data.descripcion ?? "",
    version: data.version ?? "1.0",
  });
}
