import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req, context) {
  // ⬅️ Aquí va la parte crítica: params es un PROMISE
  const { id } = await context.params;

  const { data, error } = await supabaseAdmin
    .from("plugins")
    .select("id, nombre, descripcion, precio, archivo_url, video_url, imagen_url, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json(data);
}