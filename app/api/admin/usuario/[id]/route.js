import { NextResponse } from "next/server";
import { requireAdmin } from "../../_utils";

export async function GET(req, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json(auth, { status: auth.status });

  const { supabase } = auth;

  const { data } = await supabase
    .from("usuarios")
    .select("*, licencias(*), pagos(*)")
    .eq("id", params.id)
    .single();

  return NextResponse.json(data);
}

export async function PUT(req, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json(auth, { status: auth.status });

  const { supabase } = auth;
  const body = await req.json();

  const { error } = await supabase
    .from("usuarios")
    .update(body)
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
