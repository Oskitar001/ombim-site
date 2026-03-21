// ======================================================
// 3) API PARA ACTUALIZAR USUARIO DESDE ADMIN
//    app/api/admin/users/update/route.js
// ======================================================
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function supabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(req) {
  try {
    const { userId, nombre, email, role } = await req.json();

    const supabase = supabaseAdmin();

    // 🔥 Actualizar email + metadata
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      email,
      user_metadata: {
        nombre,
        role
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