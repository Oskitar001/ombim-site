import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

    const form = await req.formData();

    const nombre = form.get("nombre");
    const descripcion = form.get("descripcion");
    const video_url = form.get("video_url") || null;
    const archivo = form.get("archivo");

    if (!archivo) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    }

    // Subir archivo a Supabase Storage
    const fileName = `${Date.now()}-${archivo.name}`;
    const { data: fileData, error: uploadError } = await supabase.storage
      .from("plugins")
      .upload(fileName, archivo);

    if (uploadError) {
      return NextResponse.json({ error: "Error al subir archivo" }, { status: 500 });
    }

    const archivo_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/plugins/${fileName}`;

    // Guardar en la base de datos
    const { error: dbError } = await supabase.from("plugins").insert({
      nombre,
      descripcion,
      archivo_url,
      video_url
    });

    if (dbError) {
      return NextResponse.json({ error: "Error al guardar plugin" }, { status: 500 });
    }

    return NextResponse.json({ message: "Plugin subido correctamente" });

  } catch (err) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
