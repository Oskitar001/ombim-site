import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const plugin_id = searchParams.get("plugin_id");
    const empresa_id = searchParams.get("empresa_id");

    if (!plugin_id) {
      return NextResponse.json(
        { error: "Falta plugin_id" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SECRET_KEY
    );

    // Obtener plugin desde Supabase
    const { data: plugin, error } = await supabase
      .from("plugins")
      .select("*")
      .eq("id", plugin_id)
      .single();

    if (error || !plugin) {
      return NextResponse.json(
        { error: "Plugin no encontrado" },
        { status: 404 }
      );
    }

    // Crear sesión de pago en Stripe
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: plugin.stripe_price_id,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/empresa/licencias?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/empresa/plugins/${plugin_id}?cancel=1`,
      metadata: {
        plugin_id,
        empresa_id: empresa_id || "desconocida",
      },
    });

    return NextResponse.redirect(session.url);
  } catch (error) {
    console.error("❌ Error en checkout:", error);
    return NextResponse.json(
      { error: "Error al crear sesión de pago" },
      { status: 500 }
    );
  }
}
