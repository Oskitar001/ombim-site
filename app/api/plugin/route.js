// app/api/plugin/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("plugins")
    .select("id, nombre, descripcion, precio, video_url, imagen_url, version")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "No se pudieron obtener los plugins" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}