// app/api/admin/licencias/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json(admin, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("licencias")
    .select("*, plugins(nombre)")
    .order("fecha_creacion", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Error DB" }, { status: 500 });
  }

  return NextResponse.json({ licencias: data ?? [] });
}
