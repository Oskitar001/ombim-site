// app/api/admin/plugins/editar/[id]/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export const runtime = "nodejs";

export async function POST(req, ctx) {
  // ✔ Next.js 15/16 → params es una PROMESA
  const { id } = await ctx.params;

  if (!id) {
    return NextResponse.json({ error: "ID faltante" }, { status: 400 });
  }

  // ✔ Verificar administrador
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  // ✔ Leer body JSON
  let body;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  // ✔ Preparar datos normalizados
  const payload = {
    nombre: body.nombre ?? "",
    descripcion: body.descripcion ?? "",
    precio: Number(body.precio) || 0,
    precio_anual: Number(body.precio_anual) || 0,
    precio_completa: Number(body.precio_completa) || 0,
    archivo_url: body.archivo_url ?? "",
    video_url: body.video_url ?? "",
    imagen_url: body.imagen_url ?? "",
  };

  // ✔ Hacer UPDATE real
  const { error } = await supabaseAdmin
    .from("plugins")
    .update(payload)
    .eq("id", id);

  if (error) {
    console.error("❌ Error Supabase UPDATE:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}