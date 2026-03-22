import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return NextResponse.json({ user: null, role: null });
  }

  const user = data.user;
  const role = user.user_metadata?.role || "user";

  return NextResponse.json({ user, role });
}
