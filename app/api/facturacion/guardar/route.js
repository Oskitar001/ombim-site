import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const {
    user_id,
    nombre,
    nif,
    direccion,
    ciudad,
    cp,
    pais,
    telefono,
  } = body;

  if (user_id !== userData.user.id) {
    return NextResponse.json(
      { error: "No puedes modificar datos de otro usuario" },
      { status: 403 }
    );
  }

  // Comprobar si ya existe registro de facturación
  const { data: existente } = await supabase
    .from("facturacion")
    .select("*")
    .eq("user_id", user_id)
    .single();

  let resultado;

  if (existente) {
    // 🔵 Actualizar
    resultado = await supabase
      .from("facturacion")
      .update({
        nombre,
        nif,
        direccion,
        ciudad,
        cp,
        pais,
        telefono,
        updated_at: new Date(),
      })
      .eq("user_id", user_id);
  } else {
    // 🔵 Insertar
    resultado = await supabase.from("facturacion").insert({
      user_id,
      nombre,
      nif,
      direccion,
      ciudad,
      cp,
      pais,
      telefono,
    });
  }

  if (resultado.error) {
    return NextResponse.json(
      { error: "Error guardando datos", detalle: resultado.error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
