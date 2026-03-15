import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Next.js 16 — reemplaza config
export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // necesario para webhooks

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;

  // -----------------------------
  // VALIDAR FIRMA DEL WEBHOOK
  // -----------------------------
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Error verificando webhook:", err.message);
    return NextResponse.json({ error: "Webhook inválido" }, { status: 400 });
  }

  // -----------------------------
  // PROCESAR EVENTO
  // -----------------------------
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const plugin = session.metadata?.plugin;
      const cantidad = parseInt(session.metadata?.cantidad || "1", 10);
      const email = session.customer_details?.email;

      if (!plugin || !email) {
        console.error("⚠ Faltan datos en metadata o email");
        return NextResponse.json({ received: true });
      }

      // -----------------------------
      // 1. CREAR EMPRESA
      // -----------------------------
      const { data: empresa, error: empresaError } = await supabase
        .from("empresas")
        .insert({
          nombre: "Nueva Empresa",
          email,
          password_hash: "",
          estado: "activa",
        })
        .select()
        .single();

      if (empresaError) {
        console.error("❌ Error creando empresa:", empresaError);
        return NextResponse.json({ received: true });
      }

      // -----------------------------
      // 2. CREAR LICENCIA
      // -----------------------------
      const fechaExpiracion = new Date();
      fechaExpiracion.setFullYear(fechaExpiracion.getFullYear() + 1);

      const { error: licenciaError } = await supabase.from("licencias").insert({
        empresa_id: empresa.id,
        plugin,
        cantidad,
        max_dispositivos: 1,
        fecha_expiracion: fechaExpiracion.toISOString(),
        estado: "activa",
      });

      if (licenciaError) {
        console.error("❌ Error creando licencia:", licenciaError);
        return NextResponse.json({ received: true });
      }

      // -----------------------------
      // 3. ENVIAR EMAIL AL CLIENTE
      // -----------------------------
      try {
        await resend.emails.send({
          from: "Licencias OMBIM <noreply@tudominio.com>",
          to: email,
          subject: "Tu licencia de OMBIM está lista",
          html: `
            <h1>Gracias por tu compra</h1>
            <p>Tu licencia del plugin <strong>${plugin}</strong> ha sido activada.</p>
            <p>Puedes acceder a tu panel aquí:</p>
            <p><a href="${process.env.NEXT_PUBLIC_DOMAIN}/empresa/login">Acceder al panel</a></p>
          `,
        });
      } catch (emailError) {
        console.error("⚠ Error enviando email:", emailError);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Error procesando webhook:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
