export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdmin } from "@/lib/checkAdmin";

export async function POST(req) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await req.json();

  await supabaseAdmin
    .from("licencia_activaciones")
    .delete()
    .eq("licencia_id", id);

  await supabaseAdmin
    .from("licencias")
    .update({ activaciones_usadas: 0 })
    .eq("id", id);

  return NextResponse.json({ message: "Activaciones reiniciadas" });
}
