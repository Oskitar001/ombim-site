export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdmin } from "@/lib/checkAdmin";

export async function GET(req, { params }) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = params;

  const { data: licencia, error } = await supabaseAdmin
    .from("licencias")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: activaciones } = await supabaseAdmin
    .from("licencia_activaciones")
    .select("*")
    .eq("licencia_id", id);

  return NextResponse.json({ licencia, activaciones });
}
