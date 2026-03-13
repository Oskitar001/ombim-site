import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { enviarEmail } from "@/lib/email";

export async function POST(req) {
  const { email, password, estado, expiracion } = await req.json();

  // Validar email duplicado
  const { data: existing } = await supabase
    .from("usuarios")
    .select("id")
    .eq("email", email)
    .limit(1);

  if (existing?.length > 0) {
    return NextResponse.json({ ok: false, error: "El email ya existe" });
  }

  // Guardar contraseña en texto plano
  const password_hash = password;

  const { error } = await supabase.from("usuarios").insert({
    email,
    password_hash,
    estado,
    fecha_expiracion: expiracion,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message });
  }

  // Enviar email al usuario
  const html = `
    <h2>Bienvenido a OMBIM</h2>
    <p>Tu cuenta ha sido creada correctamente.</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Contraseña:</strong> ${password}</p>
    <p><strong>Estado:</strong> ${estado}</p>
    <p><strong>Expira:</strong> ${expiracion}</p>
    <br>
    <p>Puedes iniciar sesión en el plugin inmediatamente.</p>
  `;

  await enviarEmail(email, "Tu cuenta ha sido creada", html);

  return NextResponse.json({ ok: true });
}
