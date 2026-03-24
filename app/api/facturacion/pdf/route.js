// app/api/facturacion/pdf/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function GET(req) {
  const supabase = await supabaseServer();
  const { searchParams } = new URL(req.url);
  const pago_id = searchParams.get("pago_id");

  if (!pago_id) {
    return NextResponse.json({ error: "Falta pago_id" }, { status: 400 });
  }

  const { data: pago } = await supabase
    .from("pagos")
    .select("*, licencias(*)")
    .eq("id", pago_id)
    .single();

  if (!pago) {
    return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  if (!pago.numero_factura) {
    return NextResponse.json(
      { error: "Falta número de factura" },
      { status: 400 }
    );
  }

  const { data: facturacion } = await supabase
    .from("facturacion")
    .select("*")
    .eq("user_id", pago.user_id)
    .single();

  if (!facturacion) {
    return NextResponse.json(
      { error: "No hay datos de facturación" },
      { status: 400 }
    );
  }

  const { data: empresa } = await supabase
    .from("empresa")
    .select("*")
    .eq("id", 1)
    .single();

  if (!empresa) {
    return NextResponse.json(
      { error: "Datos fiscales no configurados" },
      { status: 500 }
    );
  }

  const base = pago.importe;
  const iva = (base * 0.21).toFixed(2);
  const total = (base * 1.21).toFixed(2);

  const html = `
  <h2>Factura #${pago.numero_factura}</h2>
  <p>Fecha: ${new Date().toLocaleDateString()}</p>

  <h3>Cliente</h3>
  ${facturacion.nombre}<br>
  ${facturacion.direccion}<br>
  ${facturacion.cp} ${facturacion.ciudad}<br>

  <h3>Detalle</h3>
  <table border="1">
    <tr><th>Concepto</th><th>Cant</th><th>Base</th><th>IVA</th><th>Total</th></tr>
    <tr>
      <td>${pago.plugin_id}</td>
      <td>${pago.cantidad_licencias}</td>
      <td>${base} €</td>
      <td>${iva} €</td>
      <td>${total} €</td>
    </tr>
  </table>

  <h3>Licencias</h3>
  ${pago.licencias.map((l) => `Email Tekla: ${l.email_tekla}`).join("<br>")}

  <h3>Total: ${total} €</h3>

  <h4>${empresa.nombre}</h4>
  ${empresa.cif}<br>
  ${empresa.direccion}
  `;

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=factura-${pago.numero_factura}.pdf`,
    },
  });
}