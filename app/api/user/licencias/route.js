// /app/api/user/licencias/route.js
import { supabaseRoute } from "@/lib/supabaseRoute";
import { NextResponse } from "next/server";

export async function GET() {
  // ✔ FIX: supabaseRoute es async
  const supabase = await supabaseRoute();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ licencias: [] }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("licencias")
    .select("*, plugins(nombre)")
    .eq("user_id", user.id)
    .order("fecha_creacion", { ascending: false });

  // ✔ Manejo de error correcto
  if (error || !data) {
    console.error("Error obteniendo licencias:", error);
    return NextResponse.json({ licencias: [] });
  }

  const licencias = data.map((l) => ({
    id: l.id,
    email_tekla: l.email_tekla,
    plugin_id: l.plugin_id,
    plugin_nombre: l.plugins?.nombre ?? "",
    estado: l.estado,
    tipo: l.tipo,
    activaciones_usadas: l.activaciones_usadas,
    max_activaciones: l.max_activaciones,
    fecha_creacion: l.fecha_creacion,
    fecha_expiracion: l.fecha_expiracion,
  }));

  return NextResponse.json({ licencias });
}