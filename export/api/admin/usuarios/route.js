import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";

export async function GET() {
  // 1) Comprobar admin
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "no_autorizado" }, { status: 403 });
  }

  // 2) Obtener usuarios desde Supabase Auth
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "error_listando_usuarios" },
      { status: 500 }
    );
  }

  // 3) Mapear correctamente -> AQUÍ estaba EL PROBLEMA
  const users = data.users.map((u) => ({
    id: u.id,
    email: u.email,
    last_sign_in_at: u.last_sign_in_at,
    created_at: u.created_at,
    confirmed_at: u.confirmed_at,
    user_metadata: u.user_metadata ?? {},   // 🔥 NECESARIO
  }));

  return NextResponse.json({ users });
}