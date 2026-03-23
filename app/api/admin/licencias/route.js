import { NextResponse } from "next/server";
import { requireAdmin } from "../_utils";

export async function GET(req) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json(auth, { status: auth.status });

  const { supabase } = auth;
  const q = req.nextUrl.searchParams.get("q") || "";

  const { data } = await supabase
    .from("licencias")
    .select("*, plugins(nombre)")
    .ilike("email_tekla", `%${q}%`)
    .order("fecha_creacion", { ascending: false });

  return NextResponse.json({ licencias: data });
}
