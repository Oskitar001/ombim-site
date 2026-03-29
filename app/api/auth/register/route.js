import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendEmail } from "@/lib/email";

export async function POST(req) {
  const { nombre, email, password, empresa, telefono, pais, idioma } = await req.json();

  if (!nombre || !email || !password) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  // 1. Crear usuario sin confirmar
  const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
    user_metadata: { nombre, empresa, telefono, pais, idioma, role: "user" }
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // 2. Generar link de confirmación
  const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
    type: "signup",
    email
  });

  const confirmUrl = linkData?.properties?.action_link;

  // 3. Enviar email con el enlace correcto
  await sendEmail({
    to: email,
    subject: "Confirma tu cuenta – OMBIM",
    html: `
      <p>Hola ${nombre},</p>
      <p>Gracias por registrarte en OMBIM.</p>
      <p>Para activar tu cuenta, haz clic en este enlace:</p>
      <p><a href="${confirmUrl}" style="color:#1a73e8; font-weight:bold;">Confirmar cuenta</a></p>
      <p>Si no has creado esta cuenta, ignora el mensaje.</p>
    `
  });

  return NextResponse.json({
    ok: true,
    message: "Registro completado. Revisa tu email para confirmar tu cuenta."
  });
}