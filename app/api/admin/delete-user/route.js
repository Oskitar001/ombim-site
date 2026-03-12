import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  const { id } = await req.json();

  await supabase.from("dispositivos").delete().eq("id", id);

  return NextResponse.jsoimport { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ ok: false, error: "ID requerido" });
    }

    // Eliminar dispositivos asociados
    await supabase.from("dispositivos").delete().eq("usuario_id", id);

    // Eliminar logs asociados
    await supabase.from("logs").delete().eq("usuario_id", id);

    // Eliminar usuario
    const { error } = await supabase.from("usuarios").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message });
    }

    return NextResponse.json({ ok: true });

  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error interno" });
  }
}
n({ ok: true });
}
