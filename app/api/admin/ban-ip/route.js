// app/api/admin/ban-ip/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { ip, razon } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // Insertar IP baneada
  await supabase.from("ips_baneadas").insert({
    ip,
    razon,
    fecha: new Date().toISOString()
  });

  return NextResponse.json({ ok: true });
}
