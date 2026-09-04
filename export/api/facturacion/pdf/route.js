// /app/api/facturacion/pdf/route.js
import { generarNumeroFactura } from "@/lib/generarNumeroFactura";
import { guardarFactura } from "@/lib/guardarFactura";
import { generateInvoicePdf } from "@/lib/pdf2";
import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();

    // =========================================
    // ✅ MODO MANUAL (EL TUYO)
    // =========================================
    if (body?.manual) {
      const { cliente, lineas, usarRetencion, pedidos = [] } = body;

      if (!cliente || !lineas || lineas.length === 0) {
        return NextResponse.json(
          { ok: false, error: "datos_incompletos" },
          { status: 400 }
        );
      }

      // ✅ NUMERO FACTURA
      const numeroFactura = await generarNumeroFactura();

      // ✅ GUARDAR EN DB
      try {
        await guardarFactura({
          numeroFactura,
          cliente,
          lineas,
          usarRetencion,
          pedidos
        });
      } catch (e) {
        console.error("Error guardando factura:", e);
      }

      // ✅ FECHA
      const fechaRaw = new Date();
      const fecha = `${fechaRaw
        .getDate()
        .toString()
        .padStart(2, "0")}/${(fechaRaw.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${fechaRaw.getFullYear()}`;

      // ✅ LINEAS -> PDF
      const licencias = lineas.map((l) => ({
        nombrePlugin: l.concepto,
        precioUnitario: Number(l.precio) || 0,
        cantidad: Number(l.cantidad) || 1,
      }));

      const datosPdf = {
        manual: true,
        numeroFactura,
        fecha,
        razonSocial: cliente.nombre,
        nif: cliente.nif,
        direccion: cliente.direccion,
        ciudad: cliente.ciudad,
        cp: cliente.cp,
        telefono: cliente.telefono,
        licencias,
        usarRetencion,
        pedidos,
      };

      const pdfBuffer = await generateInvoicePdf(datosPdf);

      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="factura-${numeroFactura}.pdf"`,
        },
      });
    }

    // =========================================
    // ✅ MODO ORIGINAL (NO TOCADO)
    // =========================================

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
      .select(
        "id, user_id, plugin_id, tipo, importe, cantidad_licencias, numero_factura, fecha"
      )
      .eq("id", pagoId)
      .single();

    if (pagoErr || !pago) {
      console.error("Error cargando pago:", pagoErr);
      return NextResponse.json(
        { ok: false, error: "pago_no_encontrado" },
        { status: 404 }
      );
    }

    // 2. Usuario
    const { data: userData, error: userErr } =
      await supabase.auth.admin.getUserById(pago.user_id);

    if (userErr) {
      console.error("Error cargando usuario:", userErr);
    }

    const user = userData?.user ?? {};

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
      email: l.email_tekla?.trim() ?? "",
      tipo: l.tipo,
      precioUnitario:
        pago.cantidad_licencias > 0
          ? pago.importe / pago.cantidad_licencias
          : 0,
      cantidad: 1,
    }));

    // 5. Fecha
    const fechaRaw = new Date(pago.fecha);
    const fecha = `${fechaRaw
      .getDate()
      .toString()
      .padStart(2, "0")}/${(fechaRaw.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${fechaRaw.getFullYear()}`;

    const datosPdf = {
      pagoId,
      numeroFactura:
        pago.numero_factura ??
        `OMBIM-${new Date().getFullYear()}-${String(pago.id).padStart(6, "0")}`,
      fecha,
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
      usarRetencion: false,
    };

    const pdfBuffer = await generateInvoicePdf(datosPdf);

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