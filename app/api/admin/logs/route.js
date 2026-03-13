// app/api/admin/logs/route.js
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
    .from("logs")
    .select(`
      id,
      usuario_id,
      accion,
      ip,
      fecha,
      usuarios (
        email,
        estado,
        fecha_expiracion
      )
    `)
    .eq("usuario_id", usuario);

  if (q.trim() !== "") {
    query = query.ilike("accion", `%${q}%`);
  }

  const { data, error } = await query.order("fecha", { ascending: false });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message });
  }

  return NextResponse.json({ ok: true, logs: data });
}
