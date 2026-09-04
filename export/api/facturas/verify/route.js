// /app/api/facturas/verify/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const pagoId = url.searchParams.get("pago_id");

    if (!pagoId) {
      return NextResponse.json(
        {
          ok: false,
          error: "faltan_datos",
          mensaje: "Debes enviar ?pago_id=ID",
        },
        { status: 400 }
      );
    }

    // ===============================
    // 1. Obtener pago
    // ===============================
    const { data: pago, error: pagoErr } = await supabaseAdmin
      .from("pagos")
      .select("id, plugin_id, user_id, estado, numero_factura, fecha, importe, cantidad_licencias, tipo")
      .eq("id", pagoId)
      .single();

    if (pagoErr || !pago) {
      return NextResponse.json(
        {
          ok: false,
          valida: false,
          mensaje: "Factura no encontrada",
        },
        { status: 404 }
      );
    }

    // ===============================
    // 2. Factura válida si:
    //   - existe el pago
    //   - estado != "pendiente"
    // ===============================
    const esValida = pago.estado !== "pendiente";

    // ===============================
    // 3. Respuesta formateada
    // ===============================
    return NextResponse.json({
      ok: true,
      valida: esValida,
      mensaje: esValida
        ? "Factura válida y verificada."
        : "Factura encontrada pero no validada aún.",
      factura: {
        pago_id: pago.id,
        numero: pago.numero_factura ?? `OMBIM-${new Date().getFullYear()}-${String(pago.id).padStart(6, "0")}`,
        fecha: pago.fecha,
        plugin_id: pago.plugin_id,
        importe: pago.importe,
        cantidad_licencias: pago.cantidad_licencias,
        tipo: pago.tipo,
        estado: pago.estado,
      },
    });

  } catch (err) {
    console.error("❌ Error en verify:", err);
    return NextResponse.json(
      {
        ok: false,
        valida: false,
        error: "error_interno",
        mensaje: err.message,
      },
      { status: 500 }
    );
  }
}