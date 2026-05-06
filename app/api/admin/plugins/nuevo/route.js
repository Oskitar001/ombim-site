// /app/api/admin/plugins/nuevo/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export const runtime = "nodejs";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json(
      { error: "no_autorizado" },
      { status: 403 }
    );
  }

  const body = await req.json();

  const {
    nombre,
    descripcion,
    precio,
    precio_trimestral,     // ✅ NUEVO
    precio_anual,
    precio_completa,
    permite_trimestral,    // ✅ NUEVO
    permite_anual,         // ✅ NUEVO
    permite_completa,      // ✅ NUEVO
    archivo_url,
    video_url,
    imagen_url,
  } = body;

  if (!nombre) {
    return NextResponse.json({ error: "Falta nombre" }, { status: 400 });
  }

  const payload = {
    nombre: nombre ?? "",
    descripcion: descripcion ?? "",
    precio: Number(precio) || 0,

    // ✅ NUEVOS CAMPOS
    precio_trimestral: Number(precio_trimestral) || 0,
    precio_anual: Number(precio_anual) || 0,
    precio_completa: Number(precio_completa) || 0,

    permite_trimestral: Boolean(permite_trimestral),
    permite_anual: Boolean(permite_anual),
    permite_completa: Boolean(permite_completa),

    archivo_url: archivo_url ?? "",
    video_url: video_url ?? "",
    imagen_url: imagen_url ?? "",
  };

  const { error } = await supabaseAdmin
    .from("plugins")
    .insert(payload);

  if (error) {
    console.error("❌ Error insertando plugin:", error);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}