// app/api/licencias/todas/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export async function GET(req) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  // ✔ FIX: normalizar id
  const id = new URL(req.url).searchParams.get("id")?.trim();

  if (!id) {
    return NextResponse.json({ error: "Falta id" }, { status: 400 });
  }

  // ✔ FIX: capturar error del SELECT
  const { data, error } = await supabaseAdmin
    .from("licencias")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error cargando licencia:", error);
    return NextResponse.json({ error: "Licencia no encontrada" }, { status: 404 });
  }

  return NextResponse.json({ licencia: data });
}