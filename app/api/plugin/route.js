// app/api/plugin/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("plugins")
    .select(
      "id, nombre, descripcion, precio, video_url, imagen_url, version"
    )
    .order("created_at", { ascending: false });

  // Si hay error → devolver SIEMPRE array vacío
  if (error) {
    return NextResponse.json([], { status: 500 });
  }

  // Si no hay plugins, devolver array vacío también
  return NextResponse.json(data ?? []);
}