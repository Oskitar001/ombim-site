import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export async function GET(req, ctx) {
  // Next.js 16 → ctx.params es un promise
  const { id } = await ctx.params;

  // Validar admin
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "no_autorizado" }, { status: 403 });
  }

  // Validar id
  if (!id || id === "undefined") {
    return NextResponse.json({ error: "id_invalido" }, { status: 400 });
  }

  // Buscar usuario
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(id);

  if (error || !data?.user) {
    return NextResponse.json({ error: "usuario_no_encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: data.user.id,
      email: data.user.email,
      created_at: data.user.created_at,
      last_sign_in_at: data.user.last_sign_in_at,
      user_metadata: data.user.user_metadata ?? {},
    }
  });
}