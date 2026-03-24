// app/api/admin/licencias/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json(admin, { status: 403 });
  }

  const q = req.nextUrl.searchParams.get("q") ?? "";

  const { data } = await supabaseAdmin
    .from("licencias")
    .select("*, plugins(nombre)")
    .ilike("email_tekla", `%${q}%`)
    .order("fecha_creacion", { ascending: false });

  return NextResponse.json({ licencias: data });
}