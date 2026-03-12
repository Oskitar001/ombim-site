import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("dispositivos")
    .select("*")
    .order("id", { ascending: false });

  return NextResponse.json(data || []);
}
