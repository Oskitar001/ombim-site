// /app/api/user/update/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function POST(req) {
  const supabase = await supabaseServer();
  const body = await req.json();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: "no_autenticado" }, { status: 401 });
  }

  // Sanitizar/normalizar datos
  const nombre = body?.nombre?.trim() ?? "";
  const empresa = body?.empresa?.trim() ?? "";
  const telefono = body?.telefono?.trim() ?? "";
  const pais = body?.pais?.trim() ?? "";

  // Actualizar metadata
  const { error: updateErr } = await supabase.auth.updateUser({
    data: { nombre, empresa, telefono, pais },
  });

  if (updateErr) {
    console.error("Error actualizando user_metadata:", updateErr);
    return NextResponse.json({ error: "error_actualizando" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
``