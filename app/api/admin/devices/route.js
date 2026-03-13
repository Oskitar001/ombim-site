// app/api/admin/devices/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  const usuario = req.nextUrl.searchParams.get("usuario");
  const q = req.nextUrl.searchParams.get("q") || "";

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  let query = supabase
    .from("dispositivos")
    .select("*")
    .eq("usuario_id", usuario);

  if (q.trim() !== "") {
    query = query.ilike("hardware_id", `%${q}%`);
  }

  const { data } = await query.order("id", { ascending: true });

  return NextResponse.json({ dispositivos: data });
}
