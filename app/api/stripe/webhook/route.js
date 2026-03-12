import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { enviarEmail } from "@/lib/email";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const email = session.customer_details.email;

    // Generar contraseña
    const password = Math.random().toString(36).slice(-10);
    const password_hash = await bcrypt.hash(password, 10);

    // Expiración: 30 días
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + 30);
    const expiracion = fecha.toISOString().split("T")[0];

    // Crear usuario
    await supabase.from("usuarios").insert({
      email,
      password_hash,
      estado: "activo",
      fecha_expiracion: expiracion,
    });

    // Enviar email
    const html = `
      <h2>Tu licencia está lista</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Contraseña:</strong> ${password}</p>
      <p><strong>Expira:</strong> ${expiracion}</p>
      <p>Gracias por tu compra.</p>
    `;

    await enviarEmail(email, "Tu licencia OMBIM", html);

    // Registrar log
    await supabase.from("logs").insert({
      usuario_email: email,
      accion: "compra",
      detalle: "Licencia creada automáticamente por Stripe",
    });
  }

  return NextResponse.json({ received: true });
}
