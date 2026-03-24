// app/api/licencias/mias/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const supabase = await supabaseServer();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      return NextResponse.json({ error: "NO_LOGIN" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("licencias")
      .select("*, plugins(nombre)")
      .eq("user_id", userData.user.id)
      .order("fecha_creacion", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "ERROR_DB" }, { status: 500 });
    }

    const licencias = data.map((l) => ({
      id: l.id,
      email_tekla: l.email_tekla,
      plugin_nombre: l.plugins?.nombre ?? "—",
      estado: l.estado,
      activaciones_usadas: l.activaciones_usadas,
      max_activaciones: l.max_activaciones,
      fecha_creacion: l.fecha_creacion,
    }));

    return NextResponse.json(licencias);
  } catch (err) {
    return NextResponse.json({ error: "ERROR_INTERNO" }, { status: 500 });
  }
}