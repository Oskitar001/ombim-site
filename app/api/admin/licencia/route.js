import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function GET(req) {
  const id = req.nextUrl.searchParams.get("id");

  const { data, error } = await supabase
    .from("licencias")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }

  return NextResponse.json(data);
}
