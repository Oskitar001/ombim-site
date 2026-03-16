import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  const form = await req.formData();

  const id = form.get("id");
  const nombre = form.get("nombre");
  const descripcion = form.get("descripcion");
  const video_url = form.get("video_url") || null;
  const archivo = form.get("archivo");

  let archivo_url = null;

  // Si sube un archivo nuevo, reemplazarlo
  if (archivo && archivo.size > 0) {
    const fileName = `${Date.now()}-${archivo.name}`;

    const { error: uploadError } = await supabase.storage
      .from("plugins")
      .upload(fileName, archivo);

    if (uploadError) {
      return NextResponse.json({ error: "Error al subir archivo" }, { status: 500 });
    }

    archivo_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/plugins/${fileName}`;
  }

  // Actualizar en la base de datos
  const { error } = await supabase
    .from("plugins")
    .update({
      nombre,
      descripcion,
      video_url,
      ...(archivo_url && { archivo_url })
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Error al actualizar plugin" }, { status: 500 });
  }

  return NextResponse.json({ message: "Plugin actualizado" });
}
