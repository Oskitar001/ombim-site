import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const { nombre, email, password } = await req.json();

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          role: "user"
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_DOMAIN}/verify`
      }
    });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Error creando usuario" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
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
