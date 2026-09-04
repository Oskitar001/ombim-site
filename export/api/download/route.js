// app/api/download/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("descargas")
    .select("id, fecha, plugins(nombre)")
    .eq("user_id", userData.user.id)
    .order("fecha", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Error obteniendo descargas" },
      { status: 500 }
    );
  }

  const resultado = (data ?? []).map((d) => ({
    id: d.id,
    plugin_nombre: d.plugins?.nombre ?? "",
    fecha: d.fecha,
  }));

  return NextResponse.json(resultado);
}