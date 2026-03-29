// /app/api/facturacion/pdf/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { generateInvoicePdf } from "@/lib/pdf2";

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

    // 1. Obtener pago
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

    // 2. Usuario
    const { data: userData } = await supabase.auth.admin.getUserById(pago.user_id);
    const user = userData?.user;

    // 3. Facturación
    const { data: fact } = await supabase
      .from("facturacion")
      .select("*")
      .eq("user_id", pago.user_id)
      .maybeSingle();

    // 4. Licencias
    const { data: licData } = await supabase
      .from("licencias")
      .select("email_tekla, tipo")
      .eq("pago_id", pagoId);

    const licencias = (licData ?? []).map((l) => ({
      email: l.email_tekla,
      tipo: l.tipo,
      precioUnitario: pago.importe / pago.cantidad_licencias,
    }));

    // 5. Datos PDF
    const datosPdf = {
      pagoId,
      numeroFactura:
        pago.numero_factura ??
        `OMBIM-${new Date().getFullYear()}-${String(pago.id).padStart(6, "0")}`,
      fecha: new Date(pago.fecha).toLocaleDateString(),

      razonSocial:
        fact?.nombre ??
        user?.user_metadata?.empresa ??
        user?.user_metadata?.nombre ??
        "",
      nif: fact?.nif ?? "",
      direccion: fact?.direccion ?? "",
      ciudad: fact?.ciudad ?? "",
      cp: fact?.cp ?? "",
      pais: fact?.pais ?? "",
      telefono: fact?.telefono ?? "",
      email: user?.email ?? "",

      licencias,
    };

    // 6. Generar PDF (YA DEVUELVE BUFFER)
    const pdfBuffer = await generateInvoicePdf(datosPdf);

    // 7. Devolver PDF
    return new Response(pdfBuffer, {
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