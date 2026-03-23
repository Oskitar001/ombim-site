import { NextResponse } from "next/server";
import { requireAdmin } from "../../_utils";

export async function GET(_req, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json(auth, { status: auth.status });

  const { supabase } = auth;

  const { data: licencia } = await supabase
    .from("licencias")
    .select("*, plugins(nombre)")
    .eq("id", params.id)
    .single();

  const { data: activaciones } = await supabase
    .from("activaciones")
    .select("*")
    .eq("licencia_id", params.id);

  return NextResponse.json({ licencia, activaciones });
}
