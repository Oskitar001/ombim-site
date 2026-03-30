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
    // ✔ Devolver formato consistente
    return NextResponse.json({ plugins: [] }, { status: 500 });
  }

  // ✔ Asegurar siempre JSON válido
  return NextResponse.json(data ?? []);
}