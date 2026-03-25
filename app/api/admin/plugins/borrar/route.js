// app/api/admin/plugins/borrar/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
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

  const { data: plugin } = await supabaseAdmin
    .from("plugins")
    .select("id, nombre")
    .eq("id", id)
    .single();

  if (!plugin) {
    return NextResponse.json({ error: "Plugin no encontrado" }, { status: 404 });
  }

  const { error } = await supabaseAdmin.from("plugins").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  await logAdminAction({
    tipo: "BORRAR_PLUGIN",
    mensaje: `Plugin ${plugin.nombre} (#${plugin.id}) borrado`,
    user_id: admin.user.id
  });

  return NextResponse.json({ ok: true });
}