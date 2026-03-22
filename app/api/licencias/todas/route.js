import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export async function GET(req) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Falta id" }, { status: 400 });
  }

  const { data: licencia, error } = await supabaseAdmin
    .from("licencias")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !licencia) {
    return NextResponse.json(
      { error: "Licencia no encontrada" },
      { status: 404 }
    );
  }

  return NextResponse.json({ licencia });
}
