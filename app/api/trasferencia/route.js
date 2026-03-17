import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

export async function POST(req) {
  const body = await req.json();
  const { plugin_id } = body;

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // Obtener datos del plugin
  const { data: plugin } = await supabase
    .from("plugins")
    .select("*")
    .eq("id", plugin_id)
    .single();

  // Obtener usuario logueado
  const {
    data: { user }
  } = await supabase.auth.getUser();

  // Registrar pedido pendiente
  await supabase.from("pagos").insert({
    user_id: user.id,
    plugin_id,
    estado: "pendiente"
  });

  // Enviar email a Óscar
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "tuemail@dominio.com",
    subject: `Nuevo aviso de transferencia — ${plugin.nombre}`,
    text: `
El usuario ${user.email} ha indicado que ha realizado la transferencia.

Plugin: ${plugin.nombre}
Precio: ${plugin.precio} €
Plugin ID: ${plugin_id}

Revisa tu banco y confirma el pago en el panel.
    `
  });

  return NextResponse.json({ ok: true });
}
