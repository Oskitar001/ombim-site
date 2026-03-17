import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { clave } = await req.json();

  if (!clave) {
    return NextResponse.json(
      { error: "Clave requerida" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Marcar la clave como revocada
  const { data, error } = await supabase
    .from("claves_entregadas")
    .update({ revocada: true })
    .eq("clave", clave)
    .select("id") // para saber si realmente se actualizó algo
    .single();

  if (error) {
    return NextResponse.json(
      { error: "No se pudo revocar la clave" },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "La clave no existe" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true });
}
