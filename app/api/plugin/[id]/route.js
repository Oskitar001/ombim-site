import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(_req, props) {
  const { id } = await props.params;

  const { data, error } = await supabaseAdmin
    .from("plugins")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("PLUGIN ERROR:", error);
    return NextResponse.json(
      { error: "Plugin no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
