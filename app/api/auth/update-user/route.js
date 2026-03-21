
// ======================================================
// API: app/api/auth/update-user/route.js
// ======================================================
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  try {
    const { nombre, email } = await req.json();

    const supabase = await supabaseServer();

    // Obtener usuario actual
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Actualizar datos
    const { error } = await supabase.auth.updateUser({
      email: email || user.email,
      data: {
        nombre: nombre || user.user_metadata?.nombre
      }
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}