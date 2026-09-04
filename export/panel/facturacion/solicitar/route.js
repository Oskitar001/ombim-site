// /app/api/facturacion/solicitar/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { pagoId } = await req.json();

    if (!pagoId) {
      return NextResponse.json(
        { ok: false, error: "faltan_datos", mensaje: "Falta el ID del pago." },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    // 1. Comprobar que el pago existe
    const { data: pago } = await supabase
      .from("pagos")
      .select("id, factura_solicitada")
      .eq("id", pagoId)
      .maybeSingle();

    if (!pago) {
      return NextResponse.json(
        { ok: false, error: "pago_no_encontrado" },
        { status: 404 }
      );
    }

    // 2. Si ya está solicitada, responder OK igualmente
    if (pago.factura_solicitada) {
      return NextResponse.json({ ok: true, mensaje: "Ya estaba solicitada." });
    }

    // 3. Marcar como solicitada
    await supabase
      .from("pagos")
      .update({ factura_solicitada: true })
      .eq("id", pagoId);

    return NextResponse.json({
      ok: true,
      mensaje: "Factura solicitada correctamente. El administrador debe asignar un número de factura."
    });

  } catch (err) {
    console.error("❌ Error solicitando factura:", err);
    return NextResponse.json(
      { ok: false, error: "error_interno", mensaje: err.message },
      { status: 500 }
    );
  }
}