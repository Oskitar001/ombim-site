import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Buscar usuario con ese token
    const { data: users } = await supabase
      .from("users")
      .select("*")
      .eq("token_reset", token)
      .limit(1);

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 400 }
      );
    }

    const user = users[0];

    // Actualizar contraseña y borrar token
    await supabase
      .from("users")
      .update({
        password,
        token_reset: null
      })
      .eq("id", user.id);

    return NextResponse.json({
      ok: true,
      message: "Contraseña actualizada correctamente"
    });

  } catch (err) {
    console.error("RESET ERROR:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
