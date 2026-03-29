import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json();

  const {
    id,
    nombre,
    descripcion,
    precio,
    precio_anual,
    precio_completa,
    archivo_url,
    video_url,
    imagen_url,
  } = body;

  if (!id) {
    return NextResponse.json({ error: "Falta ID" }, { status: 400 });
  }

  // ✅ Normalización TOTAL (evitar null, undefined y strings no numéricos)
  const updateData = {
    nombre: nombre ?? "",
    descripcion: descripcion ?? "",
    precio: Number(precio) || 0,
    precio_anual: Number(precio_anual) || 0,
    precio_completa: Number(precio_completa) || 0,
    archivo_url: archivo_url ?? "",
    video_url: video_url ?? "",
    imagen_url: imagen_url ?? "",
  };

  const { error } = await supabaseAdmin
    .from("plugins")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("❌ Error actualizando plugin:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}