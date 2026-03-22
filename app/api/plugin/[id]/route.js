import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req, { params }) {
  const { id } = params;

  const { data, error } = await supabaseAdmin
    .from("plugins")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Plugin no encontrado" }, { status: 404 });
  }

  return NextResponse.json(data);
}
