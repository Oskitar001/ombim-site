// /app/api/admin/pagos/borrar-todos/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "no_autorizado" }, { status: 403 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "faltan_datos" }, { status: 400 });
  }

  // 1. Cargar el pago original
  const { data: pago } = await supabaseAdmin
    .from("pagos")
    .select("*")
    .eq("id", id)
    .single();

  if (!pago) {
    return NextResponse.json({ error: "pago_no_encontrado" }, { status: 404 });
  }

  // 2. Cargar emails asociados
  const { data: emails } = await supabaseAdmin
    .from("pagos_emails")
    .select("email_tekla")
    .eq("pago_id", id);

  const emailsTekla = emails?.map((e) => e.email_tekla) ?? [];

  // 3. Si NO hay emails → borrar solo el pago actual
  if (emailsTekla.length === 0) {
    await supabaseAdmin.from("pagos").delete().eq("id", id);
    return NextResponse.json({ ok: true, borrados: 1 });
  }

  // 4. Buscar pagos duplicados de este usuario + plugin + email
  const { data: duplicados } = await supabaseAdmin
    .from("pagos_emails")
    .select(
      `pago_id, email_tekla,
       pagos!inner( id, plugin_id, user_id, estado )`
    )
    .in("email_tekla", emailsTekla)
    .eq("pagos.plugin_id", pago.plugin_id)
    .eq("pagos.user_id", pago.user_id)
    .eq("pagos.estado", "pendiente");

  // 5. IDs únicos de todos los pagos duplicados encontrados
  const ids = [...new Set(duplicados.map((d) => d.pago_id))];

  // 6. Eliminar todos ellos
  await supabaseAdmin.from("pagos").delete().in("id", ids);

  return NextResponse.json({ ok: true, borrados: ids.length });
}