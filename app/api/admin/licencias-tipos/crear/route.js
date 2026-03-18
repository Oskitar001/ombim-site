export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdmin } from "@/lib/checkAdmin";

export async function POST(req) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { nombre, descripcion } = await req.json();

  if (!nombre)
    return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("licencia_tipos")
    .insert([{ nombre, descripcion }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ tipo: data });
}
