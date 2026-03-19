import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { email, password } = await req.json();

    // Buscar usuario
    const { data: users } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .limit(1);

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    const user = users[0];

    if (!user.verificado) {
      return NextResponse.json(
        { error: "Debes confirmar tu email antes de iniciar sesión." },
        { status: 403 }
      );
    }

    // Crear cookie de sesión
    const response = NextResponse.json({
      message: "Login correcto",
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        role: user.role
      }
    });

    response.cookies.set(
      "session",
      JSON.stringify({
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        role: user.role
      }),
      {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      }
    );

    return response;

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
