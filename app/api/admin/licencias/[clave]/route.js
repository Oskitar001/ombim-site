import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req, { params }) {
  const { clave } = params;

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data: usos } = await supabase
    .from("licencias_uso")
    .select("ip, user_agent, fecha")
    .eq("clave", clave)
    .order("fecha", { ascending: false });

  return NextResponse.json(usos);
}
