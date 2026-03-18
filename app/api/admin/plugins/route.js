export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdmin } from "@/lib/checkAdmin";

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { data, error } = await supabaseAdmin
    .from("plugins")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ plugins: data });
}
