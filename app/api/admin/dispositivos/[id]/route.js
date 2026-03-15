import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export async function GET(req, { params }) {
  const { data } = await supabase
    .from("dispositivos")
    .select("*")
    .eq("id", params.id)
    .single();

  return NextResponse.json(data);
}

export async function PUT(req, { params }) {
  const body = await req.json();

  const { error } = await supabase
    .from("dispositivos")
    .update(body)
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req, { params }) {
  await supabase.from("dispositivos").delete().eq("id", params.id);
  return NextResponse.json({ ok: true });
}
