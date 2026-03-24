// app/api/licencias/todas/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export async function GET(req) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const id = new URL(req.url).searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Falta id" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("licencias")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Licencia no encontrada" }, { status: 404 });
  }

  return NextResponse.json({ licencia: data });
}