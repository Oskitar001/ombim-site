// /app/api/user/facturacion/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  // ✔ FIX: supabaseRoute es async
  const supabase = await supabaseRoute();

  const { data: auth, error: authErr } = await supabase.auth.getUser();

  if (authErr || !auth?.user) {
    console.error("Error autenticando usuario:", authErr);
    return NextResponse.json({ error: "no_autenticado" }, { status: 401 });
  }

  const userId = auth.user.id;

  const { data: fact, error } = await supabase
    .from("facturacion")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error cargando facturación:", error);
    return NextResponse.json(
      { error: "error_cargando_facturacion" },
      { status: 500 }
    );
  }

  // ✔ Siempre devolver JSON válido
  return NextResponse.json(fact ?? null);
}