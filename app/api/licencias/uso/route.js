import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  const clave = req.nextUrl.searchParams.get("clave");

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data } = await supabase
    .from("licencias_uso")
    .select("*")
    .eq("clave", clave)
    .order("fecha", { ascending: false });

  return NextResponse.json(data);
}
