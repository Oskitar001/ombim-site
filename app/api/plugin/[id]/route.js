import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req, { params }) {
  // Next.js 15 → params es un Promise
  const resolved = await params;
  const plugin_id = resolved.id;

  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("plugins")
    .select("*")
    .eq("id", plugin_id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json(data);
}
