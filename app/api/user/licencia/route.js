// /app/api/user/licencia/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";
import { NextResponse } from "next/server";

export async function GET(req) {
  // ✔ FIX: supabaseRoute es async
  const supabase = await supabaseRoute();

  // Normalizar id
  const id = req.nextUrl.searchParams.get("id")?.trim();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "no_auth" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("licencias")
    .select(
      "id, email_tekla, plugin_id, estado, activaciones_usadas, max_activaciones, fecha_creacion, plugins(nombre)"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  // ✔ FIX: controlar error real
  if (error || !data) {
    console.error("Error obteniendo licencia:", error);
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ licencia: data });
}