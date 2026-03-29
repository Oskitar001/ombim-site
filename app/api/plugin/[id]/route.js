import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req, context) {
  // 🔥 FIX CRÍTICO PARA NEXT 16
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "id_faltante" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("plugins")
    .select(
      `
      id,
      nombre,
      descripcion,
      precio,
      precio_anual,
      precio_completa,
      archivo_url,
      video_url,
      imagen_url,
      version
      `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Supabase error plugins:", error);
    return NextResponse.json({ error: "error_bd" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "plugin_no_encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    ...data,
    precio: data.precio ?? 0,
    precio_anual: data.precio_anual ?? 0,
    precio_completa: data.precio_completa ?? 0,
    archivo_url: data.archivo_url ?? "",
    video_url: data.video_url ?? "",
    imagen_url: data.imagen_url ?? "",
    descripcion: data.descripcion ?? "",
    version: data.version ?? "1.0",
  });
}