// app/api/admin/users/get/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  const id = req.nextUrl.searchParams.get("id");

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { data } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", id)
    .single();

  return NextResponse.json({ usuario: data });
}
