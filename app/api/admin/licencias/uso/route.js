import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const clave = searchParams.get("clave");

  if (!clave) {
    return NextResponse.json(
      { error: "Clave requerida" },
      { status: 400 }
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data: usos, error } = await supabase
    .from("licencias_uso")
    .select("id, ip, user_agent, fecha")
    .eq("clave", clave)
    .order("fecha", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Error obteniendo historial" },
      { status: 500 }
    );
  }

  return NextResponse.json(usos);
}
