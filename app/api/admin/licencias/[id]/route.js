// /app/api/admin/licencias/[id]/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req, ctx) {
  // 🔥 FIX: params es una PROMESA → hay que hacer await
  const { id } = await ctx.params;

  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "no_autorizado" }, { status: 403 });
  }

  if (!id) {
    return NextResponse.json({ error: "id_invalido" }, { status: 400 });
  }

  const { data: licencia, error } = await supabaseAdmin
    .from("licencias")
    .select("*, plugins(nombre)")
    .eq("id", id)
    .single();

  if (error || !licencia) {
    return NextResponse.json(
      { error: "licencia_no_encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json({ licencia });
}