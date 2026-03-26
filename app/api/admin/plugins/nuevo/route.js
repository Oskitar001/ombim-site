import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";  // 💥 NECESARIO EN NEXT 16

export async function POST(req) {
  const body = await req.json();
  const { nombre, descripcion, precio, archivo_url, video_url, imagen_url } = body;

  if (!nombre) {
    return NextResponse.json({ error: "Falta nombre" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("plugins").insert({
    nombre,
    descripcion,
    precio,
    archivo_url,
    video_url,
    imagen_url,
  });

  if (error) {
    console.error(error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}