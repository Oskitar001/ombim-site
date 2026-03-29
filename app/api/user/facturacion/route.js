// /app/api/user/facturacion/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = supabaseRoute();

  const { data: auth, error: authErr } = await supabase.auth.getUser();

  if (authErr || !auth?.user) {
    return NextResponse.json({ error: "no_autenticado" }, { status: 401 });
  }

  const userId = auth.user.id;

  const { data: fact, error } = await supabase
    .from("facturacion")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "error_cargando_facturacion" },
      { status: 500 }
    );
  }

  // 🔥 DEVOLVEMOS null si no hay registro
  return NextResponse.json(fact ?? null);
}
``