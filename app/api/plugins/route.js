// /app/api/plugins/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("plugins")
    .select(`
      id,
      nombre,
      descripcion,
      precio,
      precio_anual,
      precio_completa,
      archivo_url,
      video_url,
      imagen_url,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando plugins:", error);
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(data ?? []);
}