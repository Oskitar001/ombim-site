import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import crypto from "crypto"; // ← NECESARIO

export async function POST(req) {
  const { plugin_id } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Obtener usuario logueado
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Comprobar si el pago está confirmado
  const { data: pago } = await supabase
    .from("pagos")
    .select("*")
    .eq("user_id", user.id)
    .eq("plugin_id", plugin_id)
    .eq("estado", "confirmado")
    .single();

  if (!pago) {
    return NextResponse.json(
      { error: "Pago no confirmado" },
      { status: 403 }
    );
  }

  // Generar clave
  const clave = crypto.randomUUID();

  // Guardar clave en la tabla
  await supabase.from("claves_entregadas").insert({
    user_id: user.id,
    plugin_id,
    clave
  });

  // Enviar email al usuario
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Tus claves de activación",
    text: `
Gracias por tu compra.

Aquí tienes tu clave de activación:

CLAVE: ${clave}

Instrucciones:
1. Abre el plugin
2. Ve a la sección "Activar"
3. Introduce la clave

¡Disfruta de la versión completa!
    `
  });

  return NextResponse.json({ ok: true });
}
