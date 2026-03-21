import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { checkAdmin } from "@/lib/checkAdmin";

export async function GET() {
  const isAdmin = await checkAdmin();
  if (!isAdmin) return NextResponse.json([], { status: 403 });

  const { data } = await supabaseAdmin
    .from("admin_logs")
    .select("*")
    .order("fecha", { ascending: false });

  return NextResponse.json(data || []);
}
