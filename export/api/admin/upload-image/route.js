export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const name = req.nextUrl.searchParams.get("name");
  const file = await req.blob();

  const { error } = await supabaseAdmin.storage
    .from("plugins")
    .upload(`images/${name}`, file, { upsert: true });

  if (error) return NextResponse.json({ error: true }, { status: 500 });

  const { data: url } = supabaseAdmin.storage
    .from("plugins")
    .getPublicUrl(`images/${name}`);

  return NextResponse.json({ url: url.publicUrl });
}