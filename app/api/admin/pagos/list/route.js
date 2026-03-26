import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";   // ✔ IMPORTACIÓN CORRECTA
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json(admin, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("pagos")
    .select("id, user_id, plugin_id, cantidad_licencias, estado, fecha")
    .order("fecha", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}