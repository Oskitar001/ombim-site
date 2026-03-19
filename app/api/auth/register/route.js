import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

function generarToken() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export async function POST(req) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    const { nombre, email, password } = await req.json();

    // Comprobar si ya existe
    const { data: existing } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "El correo ya está registrado" },
        { status: 400 }
      );
    }

    // Crear token de verificación
    const token = generarToken();

    // Insertar usuario
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          nombre,
          email,
          password, // sin hashing
          role: "user",
          verificado: false,
          token_verificacion: token
        }
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Error al registrar usuario" },
        { status: 500 }
      );
    }

    // Enviar email de verificación
    const resend = new Resend(process.env.RESEND_API_KEY);

    const url = `${process.env.NEXT_PUBLIC_DOMAIN}/verify?token=${token}`;

    await resend.emails.send({
      from: `"OMBIM" <notificaciones@updates.ombim.com>`,
      to: email,
      subject: "Confirma tu cuenta",
      html: `
        <h2>Bienvenido a OMBIM</h2>
        <p>Haz clic en el siguiente enlace para confirmar tu cuenta:</p>
        <p><a href="${url}">${url}</a></p>
        <p>Si no creaste esta cuenta, ignora este mensaje.</p>
      `
    });

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
