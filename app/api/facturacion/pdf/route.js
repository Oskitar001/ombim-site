// /app/api/facturacion/pdf/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { generateInvoicePdf } from "@/lib/pdf";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { pagoId } = await req.json();

    if (!pagoId) {
      return NextResponse.json(
        { ok: false, error: "pagoId_missing", mensaje: "Falta el pagoId." },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    // =====================================================
    // 1. Obtener datos del pago
    // =====================================================
    const { data: pago, error: pagoErr } = await supabase
      .from("pagos")
      .select("id, user_id, plugin_id, tipo, importe, cantidad_licencias, numero_factura, fecha")
      .eq("id", pagoId)
      .single();

    if (pagoErr || !pago) {
      return NextResponse.json(
        { ok: false, error: "pago_no_encontrado" },
        { status: 404 }
      );
    }

    // =====================================================
    // 2. Obtener datos del usuario
    // =====================================================
    const { data: userData } = await supabase.auth.admin.getUserById(pago.user_id);
    const user = userData?.user;

    // =====================================================
    // 3. Obtener datos de facturación almacenados
    // =====================================================
    const { data: fact } = await supabase
      .from("facturacion")
      .select("*")
      .eq("user_id", pago.user_id)
      .maybeSingle();

    // =====================================================
    // 4. Obtener licencias asociadas al pago
    // =====================================================
    const { data: licData } = await supabase
      .from("licencias")
      .select("email_tekla, tipo, max_activaciones, fecha_creacion")
      .eq("pago_id", pagoId);

    const licencias = (licData ?? []).map((l) => ({
      email: l.email_tekla,
      tipo: l.tipo,
      precioUnitario: pago.importe / pago.cantidad_licencias, // precio individual sin IVA
    }));

    // =====================================================
    // 5. Construir datos del PDF
    // =====================================================

    const datosPdf = {
      pagoId,
      numeroFactura: pago.numero_factura ?? `OMBIM-${new Date().getFullYear()}-${String(pago.id).padStart(6, "0")}`,
      fecha: new Date(pago.fecha).toLocaleDateString(),

      razonSocial: fact?.nombre ?? user?.user_metadata?.empresa ?? user?.user_metadata?.nombre ?? "",
      nif: fact?.nif ?? "",
      direccion: fact?.direccion ?? "",
      ciudad: fact?.ciudad ?? "",
      cp: fact?.cp ?? "",
      pais: fact?.pais ?? "",
      telefono: fact?.telefono ?? "",
      email: user?.email ?? "",

      licencias,
    };

    // =====================================================
    // 6. GENERAR PDF BONITO
    // =====================================================
    const pdfStream = await generateInvoicePdf(datosPdf);

    const chunks = [];
    for await (const chunk of pdfStream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="factura-${pago.id}.pdf"`,
      },
    });

  } catch (err) {
    console.error("❌ Error generando factura PDF:", err);
    return NextResponse.json(
      { ok: false, error: "error_interno", mensaje: err.message },
      { status: 500 }
    );
  }
}