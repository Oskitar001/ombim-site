// app/api/admin/licencias/[id]/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(req, context) {
  const { params } = context;
  const id = params.id;

  const { data: licencia } = await supabaseAdmin
    .from("licencias")
    .select("*, plugins(nombre)")
    .eq("id", id)
    .single();

  const { data: activaciones } = await supabaseAdmin
    .from("activaciones")
    .select("*")
    .eq("licencia_id", id);

  return NextResponse.json({
    licencia,
    activaciones: activaciones ?? [],
  });
}