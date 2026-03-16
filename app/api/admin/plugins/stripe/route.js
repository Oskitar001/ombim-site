import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, precio } = body;

    if (!nombre || !precio) {
      return NextResponse.json(
        { error: "Faltan datos: nombre o precio" },
        { status: 400 }
      );
    }

    // 1) Crear producto en Stripe
    const product = await stripe.products.create({
      name: nombre,
    });

    // 2) Crear precio asociado al producto
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(precio * 100), // convertir € a céntimos
      currency: "eur",
    });

    // 3) Devolver IDs a tu frontend
    return NextResponse.json({
      product_id: product.id,
      price_id: price.id,
    });
  } catch (error) {
    console.error("Error Stripe:", error);
    return NextResponse.json(
      { error: error.message || "Error creando producto en Stripe" },
      { status: 500 }
    );
  }
}
