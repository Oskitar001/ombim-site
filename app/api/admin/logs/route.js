import { NextResponse } from "next/server";
import { requireAdmin } from "../_utils";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json(auth, { status: auth.status });

  const { supabase } = auth;

  const { data } = await supabase
    .from("logs_uso")
    .select("*")
    .order("fecha", { ascending: false });

  return NextResponse.json(data);
}
