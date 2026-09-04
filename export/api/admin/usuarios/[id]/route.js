// /app/api/admin/usuarios/[id]/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export const runtime = "nodejs";

export async function GET(req, ctx) {
  // 📌 FIX Next.js 15/16 → params es PROMISE
  const { id } = await ctx.params;

  // 1. Verificar admin
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "no_autorizado" }, { status: 403 });
  }

  // 2. Obtener usuario desde AUTH
  const authRes = await supabaseAdmin.auth.admin.getUserById(id);

  if (!authRes?.data?.user) {
    return NextResponse.json({ error: "usuario_no_encontrado" }, { status: 404 });
  }

  const user = authRes.data.user;

  // 3. Obtener licencias del usuario
  const { data: licencias, error: errLic } = await supabaseAdmin
    .from("licencias")
    .select("*, plugins(nombre)")
    .eq("user_id", id);

  // 4. Obtener pagos del usuario
  const { data: pagos, error: errPagos } = await supabaseAdmin
    .from("pagos")
    .select("*, plugins(nombre)")
    .eq("user_id", id);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      user_metadata: user.user_metadata ?? {},
    },
    licencias: licencias ?? [],
    pagos: pagos ?? [],
  });
}