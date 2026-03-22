import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  try {
    const { nombre, email, password } = await req.json();

    if (!nombre || !email || !password) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Crear usuario con metadata
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        nombre,
        role: "user"
      }
    });

    if (error) {
      console.error("SUPABASE REGISTER ERROR:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Usuario con nombre incluido
    const user = {
      ...data.user,
      nombre: data.user?.user_metadata?.nombre || null
    };

    return NextResponse.json({
      ok: true,
      user,
      message: "Registro completado. Revisa tu email para confirmar tu cuenta."
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
