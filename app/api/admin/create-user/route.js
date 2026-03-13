// app/api/admin/create-user/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { enviarEmail } from "@/lib/email";

export async function POST(req) {
  const { email, password, estado, expiracion, role } = await req.json();

  // 1. Validar email duplicado
  const { data: existing } = await supabase
    .from("usuarios")
    .select("id")
    .eq("email", email)
    .limit(1);

  if (existing?.length > 0) {
    return NextResponse.json({ ok: false, error: "El email ya existe" });
  }

  // 2. Contraseña en texto plano (tu sistema actual)
  const password_hash = password;

  // 3. Insertar usuario
  const { error } = await supabase.from("usuarios").insert({
    email,
    password_hash,
    estado,
    fecha_expiracion: expiracion,
    role: role || "user",
    max_dispositivos: 1 // por defecto si no lo envías
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message });
  }

  // 4. Enviar email al usuario
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

  // 5. Registrar log
  await supabase.from("logs").insert({
    usuario_id: null,
    accion: `admin creó usuario ${email}`,
    fecha: new Date().toISOString()
  });

  return NextResponse.json({ ok: true });
}
