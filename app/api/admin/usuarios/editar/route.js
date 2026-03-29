import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin.ok)
    return NextResponse.json({ error: "no_autorizado" }, { status: 403 });

  const { id, role } = await req.json();

  if (!id || !role)
    return NextResponse.json({ error: "faltan_datos" }, { status: 400 });

  // 1) Actualizar metadata del usuario
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    id,
    {
      user_metadata: { role },
    }
  );

  if (updateError) {
    console.error(updateError);
    return NextResponse.json(
      { error: "error_actualizando" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}