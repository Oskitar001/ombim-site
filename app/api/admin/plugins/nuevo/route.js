import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs"; // ✔️ Requerido en Next 16

export async function POST(req) {
  const body = await req.json();

  const {
    nombre,
    descripcion,
    precio,
    precio_anual,
    precio_completa,
    archivo_url,
    video_url,
    imagen_url,
  } = body;

  if (!nombre) {
    return NextResponse.json({ error: "Falta nombre" }, { status: 400 });
  }

  // ✔️ Normalización completa
  const payload = {
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
    .insert(payload);

  if (error) {
    console.error("❌ Error insertando plugin:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}