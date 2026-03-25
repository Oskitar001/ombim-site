import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const body = await req.json();

  const { error } = await supabaseAdmin
    .from("plugins")
    .update({
      nombre: body.nombre,
      descripcion: body.descripcion,
      precio: body.precio,
      archivo_url: body.archivo_url,
      video_url: body.video_url,
      imagen_url: body.imagen_url,
      version: body.version,
    })
    .eq("id", body.id);

  if (error) {
    console.error(error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}