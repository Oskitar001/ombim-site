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

    // Obtener licencia
    const { data: licencia } = await supabase
      .from("licencias")
      .select("*")
      .eq("id", id)
      .single();

    if (!licencia) {
      return NextResponse.json({ error: "Licencia no encontrada" }, { status: 404 });
    }

    // Nueva expiración
    const nueva = new Date(licencia.expiracion);
    nueva.setFullYear(nueva.getFullYear() + 1);

    const { error } = await supabase
      .from("licencias")
      .update({ expiracion: nueva })
      .eq("id", id);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "No se pudo extender" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, nuevaExpiracion: nueva });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
