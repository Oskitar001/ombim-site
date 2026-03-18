import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req, context) {
  const { id } = await context.params; // ← CAMBIO IMPORTANTE

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data, error } = await supabase
    .from("plugins")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Plugin no encontrado" }, { status: 404 });
  }

  return NextResponse.json(data);
}
