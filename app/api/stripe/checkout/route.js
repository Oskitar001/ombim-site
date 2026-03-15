import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { plugin, cantidad } = await req.json();

    if (!plugin || !cantidad) {
      return NextResponse.json(
        { error: "Faltan datos de plugin o cantidad" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/cancel`,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: `Licencia ${plugin}` },
            unit_amount: 1000, // 10€ por licencia
          },
          quantity: cantidad,
        },
      ],
      metadata: {
        plugin,
        cantidad: String(cantidad),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error en checkout:", error);
    return NextResponse.json(
      { error: "Error al crear sesión de pago" },
      { status: 500 }
    );
  }
}
