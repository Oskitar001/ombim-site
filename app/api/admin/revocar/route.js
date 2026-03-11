import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function POST(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Falta id" }, { status: 400 });
    }

    const { error } = await supabase
      .from("licencias")
      .update({ estado: "revocada" })
      .eq("id", id);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "No se pudo revocar" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
