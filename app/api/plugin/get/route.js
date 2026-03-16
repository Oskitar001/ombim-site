import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  const id = req.nextUrl.searchParams.get("id");

  const { data, error } = await supabase
    .from("plugins")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  return NextResponse.json(data);
}
