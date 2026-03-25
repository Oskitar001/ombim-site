// app/api/plugin/[id]/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(_, props) {
  const { id } = props.params;

  const { data, error } = await supabaseAdmin
    .from("plugins")
    .select("id, nombre, descripcion, precio, video_url, imagen_url, version, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Plugin no encontrado" }, { status: 404 });
  }

  return NextResponse.json(data);
}