import { NextResponse } from "next/server";
import { requireAdmin } from "../../_utils";

export async function POST(req) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json(auth, { status: auth.status });

  const { supabase } = auth;
  const { id } = await req.json();

  const { error } = await supabase.from("plugins").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
