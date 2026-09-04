import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return NextResponse.json({ error: "no_autorizado" }, { status: 403 });
  }

  const licencia_id = new URL(req.url).searchParams.get("id");

  if (!licencia_id) {
    return NextResponse.json({ error: "falta_id" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("licencias_maquinas")
    .select("*")
    .eq("licencia_id", licencia_id)
    .order("fecha", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "error_db" }, { status: 500 });
  }

  return NextResponse.json({ maquinas: data ?? [] });
}

// ✅ borrar UNA máquina concreta
export async function DELETE(req) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return NextResponse.json({ error: "no_autorizado" }, { status: 403 });
  }

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "falta_id" }, { status: 400 });
  }

  await supabaseAdmin
    .from("licencias_maquinas")
    .delete()
    .eq("id", id);

  return NextResponse.json({ ok: true });
}