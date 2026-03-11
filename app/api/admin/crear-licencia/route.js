import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Falta email" }, { status: 400 });
    }

    // Crear clave aleatoria
    const clave = crypto.randomUUID();

    // Expiración: 1 año
    const expiracion = new Date();
    expiracion.setFullYear(expiracion.getFullYear() + 1);

    const { error } = await supabase.from("licencias").insert({
      email,
      clave,
      tipo: "full",
      estado: "activa",
      expiracion,
      maxActivaciones: 1
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "No se pudo crear" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, clave, expiracion });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
