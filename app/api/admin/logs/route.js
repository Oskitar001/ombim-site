import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export async function GET() {
  const { data } = await supabase.from("logs").select("*");
  return NextResponse.json(data);
}
