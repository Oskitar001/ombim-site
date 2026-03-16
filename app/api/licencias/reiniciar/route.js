import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const body = await req.json();
  const { licencia_id } = body;

  if (!licencia_id) {
    return NextResponse.json({
      ok: false,
      error: "ID de licencia requerido"
    });
  }

  // 1. Borrar activaciones
  const { error: deleteError } = await supabase
    .from("licencia_activaciones")
    .delete()
    .eq("licencia_id", licencia_id);

  if (deleteError) {
    return NextResponse.json({
      ok: false,
      error: "Error eliminando activaciones"
    });
  }

  // 2. Reset contador (si usas activaciones_usadas)
  const { error: updateError } = await supabase
    .from("licencias")
    .update({ activaciones_usadas: 0 })
    .eq("id", licencia_id);

  if (updateError) {
    return NextResponse.json({
      ok: false,
      error: "Error reseteando contador"
    });
  }

  return NextResponse.json({
    ok: true,
    error: null,
    mensaje: "Activaciones reiniciadas"
  });
}
