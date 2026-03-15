export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export async function GET() {
  const { data } = await supabase.from("empleados").select("*");
  return NextResponse.json(data);
}

export async function POST(req) {
  const body = await req.json();

  const { error } = await supabase.from("empleados").insert(body);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
