import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json(admin, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from("pagos")
    .select(`
      id,
      user_id,
      plugin_id,
      cantidad_licencias,
      estado,
      fecha,
      importe,
      importe_base,
      iva
    `)
    .order("fecha", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const pagos = data ?? [];

  // ✅ traer plugins
  const pluginIds = pagos.map(p => p.plugin_id);

  const { data: plugins } = await supabaseAdmin
    .from("plugins")
    .select("id, nombre")
    .in("id", pluginIds);

  // ✅ traer usuarios desde auth.users
  const userIds = pagos.map(p => p.user_id);

  const { data: users } = await supabaseAdmin.auth.admin.listUsers();

  // ✅ unir datos
  const lista = pagos.map(p => ({
    ...p,
    plugin_nombre: plugins?.find(pl => pl.id === p.plugin_id)?.nombre ?? null,
    user_email: users?.users?.find(u => u.id === p.user_id)?.email ?? null,
  }));

  return NextResponse.json(lista);
}