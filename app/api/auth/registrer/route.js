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
      return NextResponse.json({ error: "Error en la base de datos" }, { status: 500 });
    }

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 400 });
    }

    // Insertar usuario
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          nombre,
          email,
          password,
          role: "user"
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("DB INSERT ERROR:", error);
      return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 });
    }

    return NextResponse.json({
      message: "Usuario registrado correctamente",
      user: data
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
