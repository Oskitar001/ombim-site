import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false } }
  );

  const { data, error } = await supabase
    .from("dispositivos")
    .select("id, usuario_id, hardware_id, ultima_conexion")
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ devices: [], error: error.message });
  }

  return NextResponse.json({ devices: data });
}
