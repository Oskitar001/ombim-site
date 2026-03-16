import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  const { data, error } = await supabase.from("plugins").select("*");

  if (error) return NextResponse.json({ error: "Error al obtener plugins" }, { status: 500 });

  return NextResponse.json(data);
}
