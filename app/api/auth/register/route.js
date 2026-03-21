import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  try {
    const { nombre, email, password } = await req.json();

    const supabase = await supabaseServer();

    // Crear usuario
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          role: "user"
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/verify`
      }
    });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Obtener sesión (si Supabase la crea)
    const { data: sessionData } = await supabase.auth.getSession();

    return NextResponse.json({
      ok: true,
      user: data.user,
      session: sessionData.session,
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
