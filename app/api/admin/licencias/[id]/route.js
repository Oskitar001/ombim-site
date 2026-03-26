import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req, ctx) {
  // 🚨 Next 16: params ES UNA PROMESA
  const { id } = await ctx.params;   // ← FIX REAL

  // Cargar la licencia
  const { data: licencia, error } = await supabaseAdmin
    .from("licencias")
    .select("*, plugins(nombre)")
    .eq("id", id)
    .maybeSingle();  // ← mejor que .single()

  if (error) {
    console.error("ERROR SUPABASE (licencia):", error);
    return NextResponse.json({ error: "Error consultando la BD" }, { status: 500 });
  }

  // Si no existe
  if (!licencia) {
    return NextResponse.json({ error: "Licencia no encontrada" }, { status: 404 });
  }

  // Cargar activaciones de la licencia
  const { data: activaciones } = await supabaseAdmin
    .from("activaciones")
    .select("*")
    .eq("licencia_id", id);

  return NextResponse.json({
    licencia,
    activaciones: activaciones ?? [],
  });
}
``