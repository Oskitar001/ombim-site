import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

export async function POST(req) {
  const { id } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Obtener datos del pago
  const { data: pago } = await supabase
    .from("pagos")
    .select(`
      *,
      users ( email ),
      plugins ( nombre )
    `)
    .eq("id", id)
    .single();

  // Marcar como confirmado
  await supabase
    .from("pagos")
    .update({ estado: "confirmado" })
    .eq("id", id);

  // Enviar email al usuario con instrucciones para activar
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: pago.users.email,
    subject: `Activación del plugin ${pago.plugins.nombre}`,
    text: `
Tu pago ha sido confirmado.

Aquí tienes tus claves de activación:

CLAVE: XXXXX-XXXXX-XXXXX

Gracias por tu compra.
    `
  });

  return NextResponse.json({ ok: true });
}
