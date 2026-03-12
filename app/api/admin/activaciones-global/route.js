import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function GET() {
  const { data, error } = await supabase
    .from("activaciones")
    .select("*")
    .order("fecha", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error cargando activaciones" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
