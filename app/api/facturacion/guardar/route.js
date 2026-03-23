import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const user_id = userData.user.id;

  const body = await req.json();
  const {
    nombre,
    nif,
    direccion,
    ciudad,
    cp,
    pais,
    telefono,
  } = body;

  // 🔵 Hacemos UPSERT (insertar o actualizar automáticamente)
  const { error } = await supabase
    .from("facturacion")
    .upsert(
      {
        user_id,
        nombre,
        nif,
        direccion,
        ciudad,
        cp,
        pais,
        telefono,
        updated_at: new Date(),
      },
      { onConflict: "user_id" } // asegura que solo haya un registro por usuario
    );

  if (error) {
    return NextResponse.json(
      { error: "Error guardando datos", detalle: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
