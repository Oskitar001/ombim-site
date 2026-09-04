// /app/api/facturacion/guardar/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function POST(req) {
  const supabase = await supabaseServer();
  const body = await req.json();

  const {
    data: { user },
    error: userErr
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: "no_autenticado" }, { status: 401 });
  }

  const { usarDatosUsuario, ...factForm } = body;

  // ✔ Sanitizado y normalización
  let nombre = factForm?.nombre?.trim() ?? "";
  let nif = factForm?.nif?.trim() ?? "";
  let direccion = factForm?.direccion?.trim() ?? "";
  let ciudad = factForm?.ciudad?.trim() ?? "";
  let cp = factForm?.cp?.trim() ?? "";
  let pais = factForm?.pais?.trim() ?? "";
  let telefono = factForm?.telefono?.trim() ?? "";

  const um = user.user_metadata ?? {};

  // ✔ Copiar datos del usuario solo si se marca la casilla
  if (usarDatosUsuario) {
    nombre = um.nombre || um.empresa || nombre;
    pais = um.pais || pais;
    telefono = um.telefono || telefono;
  }

  const payload = {
    user_id: user.id,
    nombre,
    nif,
    direccion,
    ciudad,
    cp,
    pais,
    telefono,
    updated_at: new Date().toISOString()
  };

  // ✔ upsert seguro
  const { error } = await supabase
    .from("facturacion")
    .upsert(payload, { onConflict: "user_id" });

  if (error) {
    console.error("Error guardando facturación:", error);
    return NextResponse.json(
      { error: "error_guardando_facturacion" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
