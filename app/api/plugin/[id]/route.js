import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req) {
  // Obtener el ID desde la URL (Next.js 16)
  const id = req.nextUrl.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "ID no encontrado" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("plugins")
    .select("id, nombre, descripcion, precio, archivo_url, video_url, imagen_url, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error cargando plugin:", error);
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  return NextResponse.json(data);
}