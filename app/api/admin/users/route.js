// app/api/admin/users/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  const q = req.nextUrl.searchParams.get("q") || "";

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false } }
  );

  let query = supabase
    .from("usuarios")
    .select("id, email, estado, fecha_expiracion, role, max_dispositivos");

  if (q.trim() !== "") {
    query = query.ilike("email", `%${q}%`);
  }

  const { data, error } = await query.order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ users: [], error: error.message });
  }

  return NextResponse.json({ users: data });
}
