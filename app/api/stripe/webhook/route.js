import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  // Validar firma del webhook
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook inválido:", err.message);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }

  // Procesar evento
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const plugin_id = session.metadata?.plugin_id;
    const empresa_id = session.metadata?.empresa_id;
    const email = session.customer_details?.email;

    if (!plugin_id || !empresa_id) {
      console.error("⚠ Faltan plugin_id o empresa_id en metadata");
      return NextResponse.json({ received: true });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Crear licencia
    const fechaExpiracion = new Date();
    fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 1);

    const { error: licenciaError } = await supabase.from("licencias").insert({
      empresa_id,
      plugin_id,
      activa: true,
      fecha_inicio: new Date().toISOString(),
      fecha_expiracion: fechaExpiracion.toISOString(),
    });

    if (licenciaError) {
      console.error("❌ Error creando licencia:", licenciaError);
      return NextResponse.json({ received: true });
    }

    // Enviar email al cliente
    try {
      await resend.emails.send({
        from: "Licencias OMBIM <noreply@tudominio.com>",
        to: email,
        subject: "Tu licencia está activa",
        html: `
          <h1>Gracias por tu compra</h1>
          <p>Tu licencia ha sido activada correctamente.</p>
          <p>Puedes acceder a tu panel aquí:</p>
          <p><a href="${process.env.NEXT_PUBLIC_DOMAIN}/empresa/login">Acceder al panel</a></p>
        `,
      });
    } catch (emailError) {
      console.error("⚠ Error enviando email:", emailError);
    }
  }

  return NextResponse.json({ received: true });
}
