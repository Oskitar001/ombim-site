import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  const { id } = await req.json();

  await supabase.from("dispositivos").delete().eq("id", id);

  return NextResponse.json({ ok: true });
}
