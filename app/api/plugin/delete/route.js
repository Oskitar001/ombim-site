import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  }

  const { error } = await supabase.from("plugins").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Error al borrar plugin" }, { status: 500 });
  }

  return NextResponse.json({ message: "Plugin borrado" });
}
