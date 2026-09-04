// /app/api/admin/plugins/[id]/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req, ctx) {
  // NEXT 15/16 → params es una PROMESA
  const { id } = await ctx.params;

  // Verificar admin
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json(
      { error: "no_autorizado" },
      { status: 403 }
    );
  }

  if (!id || id === "undefined") {
    return NextResponse.json(
      { error: "id_invalido" },
      { status: 400 }
    );
  }

  // Obtener plugin por ID
  const { data: plugin, error } = await supabaseAdmin
    .from("plugins")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !plugin) {
    return NextResponse.json(
      { error: "plugin_no_encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({ plugin });
}