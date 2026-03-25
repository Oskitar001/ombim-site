import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req, context) {
  const { params } = context;
  const { id } = await params; // ⬅️ FIX OFICIAL Next 16

  const { data: licencia } = await supabaseAdmin
    .from("licencias")
    .select("*, plugins(nombre)")
    .eq("id", id)
    .single();

  const { data: activaciones } = await supabaseAdmin
    .from("activaciones")
    .select("*")
    .eq("licencia_id", id);

  return NextResponse.json({ licencia, activaciones });
}