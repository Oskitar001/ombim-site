import { NextResponse } from "next/server";
import { requireAdmin } from "../../_utils";

export async function GET(req) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json(auth, { status: auth.status });

  const { supabase } = auth;
  const clave = req.nextUrl.searchParams.get("clave");

  const { data } = await supabase
    .from("logs_uso")
    .select("*")
    .eq("clave", clave)
    .order("fecha", { ascending: false });

  return NextResponse.json(data);
}
