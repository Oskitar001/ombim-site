import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("plugins")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Error obteniendo plugins" }, { status: 500 });
  }

  return NextResponse.json(data);
}
