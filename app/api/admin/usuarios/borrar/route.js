// app/api/admin/usuarios/borrar/route.js
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";
import { NextResponse } from "next/server";
import { logAdminAction } from "@/lib/logAdmin";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Falta id" }, { status: 400 });
  }

  if (id === admin.user.id) {
    return NextResponse.json(
      { error: "No puedes borrarte a ti mismo" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAdminAction({
    tipo: "BORRAR_USUARIO",
    mensaje: `Usuario #${id} borrado`,
    user_id: admin.user.id
  });

  return NextResponse.json({ ok: true });
}