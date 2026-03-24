// app/api/admin/licencias/[id]/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(_, { params }) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json(admin, { status: 403 });
  }

  const { data: licencia } = await supabaseAdmin
    .from("licencias")
    .select("*, plugins(nombre)")
    .eq("id", params.id)
    .single();

  const { data: activaciones } = await supabaseAdmin
    .from("activaciones")
    .select("*")
    .eq("licencia_id", params.id);

  return NextResponse.json({ licencia, activaciones });
}