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
    const { email } = await req.json();

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Buscar usuario
    const { data: users } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (!users || users.length === 0) {
      return NextResponse.json(
        { ok: true, message: "Si el email existe, enviaremos un enlace." }
      );
    }

    const user = users[0];
    const token = generarToken();

    // Guardar token
    await supabase
      .from("users")
      .update({ token_reset: token })
      .eq("id", user.id);

    // Enviar email
    const resend = new Resend(process.env.RESEND_API_KEY);
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/reset?token=${token}`;

    await resend.emails.send({
      from: `"OMBIM" <notificaciones@updates.ombim.com>`,
      to: email,
      subject: "Restablecer contraseña",
      html: `
        <h2>Restablecer contraseña</h2>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <p><a href="${url}">${url}</a></p>
        <p>Si no solicitaste esto, ignora este mensaje.</p>
      `
    });

    return NextResponse.json({
      ok: true,
      message: "Si el email existe, enviaremos un enlace."
    });

  } catch (err) {
    console.error("RESET REQUEST ERROR:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
