// /app/api/auth/signup/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendEmail } from "@/lib/email";

export async function POST(req) {
  const body = await req.json();

  // Normalización segura
  const nombre = body?.nombre?.trim();
  const email = body?.email?.trim()?.toLowerCase();
  const password = body?.password;
  const empresa = body?.empresa ?? null;
  const telefono = body?.telefono ?? null;
  const pais = body?.pais ?? null;
  const idioma = body?.idioma ?? "es";

  if (!nombre || !email || !password) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  // 1. Crear usuario sin confirmar
  const { data: newUser, error: createErr } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // obsoleto pero mantenido por compatibilidad
      user_metadata: { nombre, empresa, telefono, pais, idioma, role: "user" }
    });

  if (createErr) {
    return NextResponse.json({ error: createErr.message }, { status: 400 });
  }

  // 2. Generar link de confirmación
  const { data: linkData, error: linkErr } =
    await supabaseAdmin.auth.admin.generateLink({
      type: "signup",
      email
    });

  if (linkErr || !linkData?.properties?.action_link) {
    console.error("Error generando link de confirmación:", linkErr);
    return NextResponse.json({ error: "error_generando_link" }, { status: 500 });
  }

  const confirmUrl = linkData.properties.action_link;

  // 3. Enviar email con HTML REAL
  await sendEmail({
    to: email,
    subject: "Confirma tu cuenta – OMBIM",
    html: `
      <p>Hola ${nombre},</p>
      <p>Gracias por registrarte en OMBIM.</p>
      <p>Para activar tu cuenta, haz clic en este enlace:</p>
      <p><a href="${confirmUrl}" style="color:#1a73e8; font-weight:bold;">Confirmar cuenta</a></p>
      <p>Si no has creado esta cuenta, ignora este mensaje.</p>
    `
  });

  return NextResponse.json({
    ok: true,
    message: "Registro completado. Revisa tu email para confirmar tu cuenta."
  });
}
``