import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const body = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { error } = await supabase.from("plugins").insert(body);

  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ ok: true });
}
