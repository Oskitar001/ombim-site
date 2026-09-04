// app/api/admin/plugins/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("plugins")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 🔥 FIX: devolver SIEMPRE { plugins: [...] }
  return NextResponse.json({ plugins: data ?? [] });
}

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const { nombre, descripcion, precio, archivo_url, video_url } = body;

  if (!nombre) {
    return NextResponse.json({ error: "Falta nombre" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("plugins")
    .insert({
      nombre,
      descripcion,
      precio: Number(precio) || 0,
      archivo_url,
      video_url,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}