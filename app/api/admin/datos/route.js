import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data: usuarios } = await supabase
    .from("users")
    .select("id, email")
    .order("email");

  const { data: plugins } = await supabase
    .from("plugins")
    .select("id, nombre")
    .order("nombre");

  return NextResponse.json({ usuarios, plugins });
}
