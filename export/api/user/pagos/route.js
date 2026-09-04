// /app/api/user/pagos/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";
import { NextResponse } from "next/server";

export async function GET() {
  // ✔ FIX: supabaseRoute es async
  const supabase = await supabaseRoute();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ pagos: [] }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("pagos")
    .select("id, plugin_id, cantidad_licencias, estado, fecha, plugins(nombre)")
    .eq("user_id", user.id)
    .order("fecha", { ascending: false });

  // ✔ FIX: controlar error real
  if (error) {
    console.error("Error obteniendo pagos:", error);
    return NextResponse.json({ pagos: [] });
  }

  const pagos = (data ?? []).map((p) => ({
    id: p.id,
    plugin_id: p.plugin_id,
    plugin_nombre: p.plugins?.nombre ?? "",
    cantidad_licencias: p.cantidad_licencias,
    estado: p.estado,
    fecha: p.fecha,
  }));

  return NextResponse.json({ pagos });
}