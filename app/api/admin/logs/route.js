import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false } }
  );

  const { data, error } = await supabase
    .from("logs")
    .select("id, usuario_id, accion, hardware_id, fecha")
    .order("id", { ascending: false });

  if (error) {
    return NextResponse.json({ logs: [], error: error.message });
  }

  return NextResponse.json({ logs: data });
}
