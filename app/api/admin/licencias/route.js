export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdmin } from "@/lib/checkAdmin";

export async function GET(req) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabaseAdmin
    .from("licencias")
    .select("*", { count: "exact" })
    .order("fecha_creacion", { ascending: false })
    .range(from, to);

  if (q) {
    query = query.or(`email_tekla.ilike.%${q}%,plugin_id.ilike.%${q}%`);
  }

  const { data, error, count } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ licencias: data, total: count, page, perPage });
}
