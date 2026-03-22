import { NextResponse } from "next/server";
import { requireAdmin } from "../_utils";

export async function POST(req) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json(auth, { status: auth.status });

  const { supabase } = auth;
  const body = await req.json();

  const { error } = await supabase.from("usuarios").insert(body);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
