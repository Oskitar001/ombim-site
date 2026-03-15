import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export async function GET(req, { params }) {
  const { data } = await supabase
    .from("empresas")
    .select("*")
    .eq("id", params.id)
    .single();

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
  await supabase.from("empresas").delete().eq("id", params.id);
  return NextResponse.json({ ok: true });
}
