import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data } = await supabase
    .from("logs")
    .select("*")
    .order("id", { ascending: false });

  return NextResponse.json(data || []);
}
