// app/api/admin/user/update/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { id, estado } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  await supabase
    .from("usuarios")
    .update({ estado })
    .eq("id", id);

  return NextResponse.json({ ok: true });
}
