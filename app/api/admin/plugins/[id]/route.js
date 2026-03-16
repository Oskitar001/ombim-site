import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// GET — obtener plugin
export async function GET(req, { params }) {
  const { data, error } = await supabase
    .from("plugins")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json(data);
}

// PUT — actualizar plugin
export async function PUT(req, { params }) {
  const body = await req.json();

  const { error } = await supabase
    .from("plugins")
    .update(body)
    .eq("id", params.id);

  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ ok: true });
}

// DELETE — eliminar plugin
export async function DELETE(req, { params }) {
  const { error } = await supabase
    .from("plugins")
    .delete()
    .eq("id", params.id);

  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ ok: true });
}
