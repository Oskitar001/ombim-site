import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function GET(req, { params }) {
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function PUT(req, { params }) {
  const body = await req.json();

  const updateData = {
    nombre: body.nombre,
    email: body.email,
    estado: body.estado,
  };

  if (body.password_hash) {
    updateData.password_hash = body.password_hash;
  }

  const { error } = await supabase
    .from("empresas")
    .update(updateData)
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req, { params }) {
  const { error } = await supabase
    .from("empresas")
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
