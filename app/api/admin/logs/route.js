// app/api/admin/logs/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { data } = await supabaseAdmin
    .from("logs_uso")
    .select("*")
    .order("fecha", { ascending: false });

  return NextResponse.json(data ?? []);
}