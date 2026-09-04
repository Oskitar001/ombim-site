// app/api/admin/plugins/editar/[id]/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export const runtime = "nodejs";

export async function POST(req, ctx) {
  const { id } = await ctx.params;

  if (!id) {
    return NextResponse.json({ error: "ID faltante" }, { status: 400 });
  }

  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  let body;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  // ✅ ACTUALIZADO
  const payload = {
    nombre: body.nombre ?? "",
    descripcion: body.descripcion ?? "",

    precio: Number(body.precio) || 0,

    // ✅ NUEVOS CAMPOS
    precio_trimestral: Number(body.precio_trimestral) || 0,
    precio_anual: Number(body.precio_anual) || 0,
    precio_completa: Number(body.precio_completa) || 0,

    permite_trimestral: Boolean(body.permite_trimestral),
    permite_anual: Boolean(body.permite_anual),
    permite_completa: Boolean(body.permite_completa),

    archivo_url: body.archivo_url ?? "",
    video_url: body.video_url ?? "",
    imagen_url: body.imagen_url ?? "",
  };

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