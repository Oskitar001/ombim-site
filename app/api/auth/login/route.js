import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { email, password } = await req.json();

    // Buscar usuario en tu tabla
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .limit(1);

    if (error) {
      console.error("DB ERROR:", error);
      return NextResponse.json(
        { error: "Error en la base de datos" },
        { status: 500 }
      );
    }

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    const user = users[0];

    // Crear respuesta JSON
    const response = NextResponse.json({
      message: "Login correcto",
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        role: user.role
      }
    });

    // Guardar cookie de sesión (HTTPS + móvil compatible)
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
        secure: true,        // obligatorio en producción (Vercel)
        sameSite: "lax",     // necesario para móvil
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 7 días
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
