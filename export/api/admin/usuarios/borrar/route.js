import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin.ok)
    return NextResponse.json({ error: "no_autorizado" }, { status: 403 });

  const { id } = await req.json();
  if (!id)
    return NextResponse.json({ error: "faltan_datos" }, { status: 400 });

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "error_borrando" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}