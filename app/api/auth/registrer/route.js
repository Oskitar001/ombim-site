import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { nombre, email, password } = await req.json();

    // Comprobar si ya existe
    const { data: existing, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (checkError) {
      console.error("DB CHECK ERROR:", checkError);
      return NextResponse.json(
        { error: "Error en la base de datos" },
        { status: 500 }
      );
    }

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "El correo ya está registrado" },
        { status: 400 }
      );
    }

    // Insertar usuario SIN bcrypt (como pediste)
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          nombre,
          email,
          password, // 🔥 sin hashing, como tú quieres
          role: "user"
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("DB INSERT ERROR:", error);
      return NextResponse.json(
        { error: "Error al registrar usuario" },
        { status: 500 }
      );
    }

    // Crear respuesta
    const response = NextResponse.json({
      message: "Usuario registrado correctamente",
      user: {
        id: data.id,
        email: data.email,
        nombre: data.nombre,
        role: data.role
      }
    });

    // 🔥 Crear cookie de sesión (igual que login)
    response.cookies.set(
      "session",
      JSON.stringify({
        id: data.id,
        email: data.email,
        nombre: data.nombre,
        role: data.role
      }),
      {
        httpOnly: true,
        secure: true,        // obligatorio en HTTPS
        sameSite: "lax",     // necesario para móvil
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 7 días
      }
    );

    return response;

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
