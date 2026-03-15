export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export async function GET(req, { params }) {
  const { data } = await supabase
    .from("logs")
    .select("*")
    .eq("id", params.id)
    .single();

  return NextResponse.json(data);
}

export async function DELETE(req, { params }) {
  await supabase.from("logs").delete().eq("id", params.id);
  return NextResponse.json({ ok: true });
}
