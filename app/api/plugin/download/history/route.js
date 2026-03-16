import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  const session = req.cookies.get("session")?.value;
  if (!session) return NextResponse.json([], { status: 200 });

  const user = JSON.parse(session);

  const { data, error } = await supabase
    .from("descargas")
    .select("*")
    .eq("user_id", user.id)
    .order("fecha", { ascending: false });

  if (error) return NextResponse.json([], { status: 200 });

  return NextResponse.json(data);
}
