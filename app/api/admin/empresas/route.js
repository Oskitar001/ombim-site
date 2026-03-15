import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export async function GET() {
  const { data } = await supabase.from("empresas").select("*");
  return NextResponse.json(data);
}

export async function POST(req) {
  const { nombre, email, password, estado } = await req.json();

  if (!nombre || !email || !password) {
    return NextResponse.json(
      { error: "Faltan datos" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("empresas").insert({
    nombre,
    email,
    password_hash: password,
    estado,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
