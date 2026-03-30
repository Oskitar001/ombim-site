// /app/api/facturacion/pdf/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { generateInvoicePdf } from "@/lib/pdf2";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const pagoId = body?.pagoId?.toString().trim();

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
      console.error("Error cargando pago:", pagoErr);
      return NextResponse.json(
        { ok: false, error: "pago_no_encontrado" },
        { status: 404 }
      );
    }

    // 2. Usuario propietario
    const { data: userData, error: userErr } =
      await supabase.auth.admin.getUserById(pago.user_id);

    if (userErr) {
      console.error("Error cargando usuario:", userErr);
    }

    const user = userData?.user ?? {};

    // 3. Facturación
    const { data: fact, error: factErr } = await supabase
      .from("facturacion")
      .select("*")
      .eq("user_id", pago.user_id)
      .maybeSingle();

    if (factErr) {
      console.error("Error obteniendo facturación:", factErr);
    }

    // 4. Licencias asociadas al pago
    const { data: licData, error: licErr } = await supabase
      .from("licencias")
      .select("email_tekla, tipo")
      .eq("pago_id", pagoId);

    if (licErr) {
      console.error("Error obteniendo licencias:", licErr);
    }

    const licencias = (licData ?? []).map((l) => ({
      email: l.email_tekla?.trim() ?? "",
      tipo: l.tipo,
      precioUnitario:
        pago.cantidad_licencias > 0
          ? (pago.importe / pago.cantidad_licencias)
          : 0,
    }));

    // 5. Preparar datos para PDF
    const fecha = new Date(pago.fecha);
    const fechaFormateada = `${fecha.getDate().toString().padStart(2, "0")}/${(
      fecha.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${fecha.getFullYear()}`;

    const datosPdf = {
      pagoId,
      numeroFactura:
        pago.numero_factura ??
        `OMBIM-${new Date().getFullYear()}-${String(pago.id).padStart(6, "0")}`,
      fecha: fechaFormateada,
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

    // 6. Generar PDF (devuelve Buffer)
    const pdfBuffer = await generateInvoicePdf(datosPdf);

    // 7. Respuesta final
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