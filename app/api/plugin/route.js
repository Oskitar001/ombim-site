// app/api/plugin/route.js

export const runtime = "nodejs";  // ⬅⬅⬅ ESTA LÍNEA ES LA CLAVE

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("plugins")
    .select("id, nombre, descripcion, precio, archivo_url, video_url, imagen_url, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando plugins:", error);
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(data ?? []);
}