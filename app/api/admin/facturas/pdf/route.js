import { generateInvoicePdf } from "@/lib/pdf2";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id_missing" }, { status: 400 });
  }

  // ✅ 1. FACTURA
  const { data: factura, error: facturaErr } = await supabaseAdmin
    .from("facturas")
    .select("*")
    .eq("id", id)
    .single();

  if (facturaErr || !factura) {
    console.error("Factura no encontrada", facturaErr);
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // ✅ 2. LINEAS
  const { data: lineas, error: lineasErr } = await supabaseAdmin
    .from("factura_lineas")
    .select("*")
    .eq("factura_id", id);

  if (lineasErr) {
    console.error("Error cargando líneas", lineasErr);
  }

  // ✅ 3. FORMATO PARA PDF
  const licencias = (lineas || []).map((l) => ({
    nombrePlugin: l.concepto,
    precioUnitario: l.precio,
    cantidad: l.cantidad,
  }));

  const datosPdf = {
    manual: true,
    numeroFactura: factura.numero,
    fecha: `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`,
    razonSocial: factura.cliente_nombre,
    nif: factura.cliente_nif,
    direccion: factura.cliente_direccion,
    ciudad: factura.cliente_ciudad,
    cp: factura.cliente_cp,
    telefono: factura.cliente_telefono,
    licencias,
    usarRetencion: factura.retencion > 0,
    pedidos: factura.pedidos
      ? factura.pedidos.split(" ").filter(p => p)
      : [],
  };

  // ✅ 4. GENERAR PDF
  const pdfBuffer = await generateInvoicePdf(datosPdf);

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
``