// /app/api/facturacion/guardar/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function POST(req) {
  const supabase = await supabaseServer();
  const body = await req.json();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "no_autenticado" }, { status: 401 });
  }

  const { usarDatosUsuario, ...factForm } = body;

  let {
    nombre,
    nif,
    direccion,
    ciudad,
    cp,
    pais,
    telefono,
  } = factForm;

  const um = user.user_metadata ?? {};

  // AUTOCOPIAR SOLO SI MARCA LA CASILLA
  if (usarDatosUsuario) {
    nombre = um.nombre || um.empresa || nombre;
    pais = um.pais || pais;
    telefono = um.telefono || telefono;
  }

  // Guardar facturación
  const { error } = await supabase.from("facturacion").upsert(
    {
      user_id: user.id,
      nombre,
      nif,
      direccion,
      ciudad,
      cp,
      pais,
      telefono,
      updated_at: new Date(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "error_guardando_facturacion" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}