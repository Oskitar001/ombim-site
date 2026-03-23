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

  // Obtener pago + licencias
  const { data: pago } = await supabase
    .from("pagos")
    .select("*, licencias(*)")
    .eq("id", pago_id)
    .single();

  if (!pago) {
    return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
  }

  // Validar número de factura
  if (!pago.numero_factura) {
    return NextResponse.json(
      { error: "No se puede generar la factura: falta número de factura" },
      { status: 400 }
    );
  }

  // Obtener datos de facturación del cliente
  const { data: facturacion } = await supabase
    .from("facturacion")
    .select("*")
    .eq("user_id", pago.user_id)
    .single();

  if (!facturacion) {
    return NextResponse.json(
      { error: "El usuario no tiene datos de facturación" },
      { status: 400 }
    );
  }

  // Obtener datos de la empresa (tú)
  const { data: empresa } = await supabase
    .from("empresa")
    .select("*")
    .eq("id", 1)
    .single();

  if (!empresa) {
    return NextResponse.json(
      { error: "No hay datos de empresa configurados" },
      { status: 500 }
    );
  }

  // Calcular IVA
  const base = pago.importe;
  const iva = (base * 0.21).toFixed(2);
  const total = (base * 1.21).toFixed(2);

  // Determinar si el cliente usa NIF o CIF
  const identificadorCliente = facturacion.cif || facturacion.nif || "";

  // HTML profesional
  let html = `
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .logo { width: 160px; }
        .section-title { font-size: 20px; margin-top: 30px; margin-bottom: 10px; font-weight: bold; }
        .box { border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        table th, table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        table th { background: #f5f5f5; }
        .total { text-align: right; font-size: 18px; margin-top: 20px; font-weight: bold; }
        .footer { margin-top: 60px; font-size: 12px; text-align: center; color: #777; }
        .firma { margin-top: 40px; text-align: right; font-size: 14px; }
        .qr { margin-top: 20px; text-align: right; }
        .qr img { width: 120px; }
      </style>
    </head>

    <body>

      <div class="header">
        <img src="${empresa.logo_url}" class="logo" />
        <div>
          <h1>Factura #${pago.numero_factura}</h1>
          <strong>Fecha:</strong> ${new Date().toLocaleDateString()}
        </div>
      </div>

      <div class="section-title">Datos del cliente</div>
      <div class="box">
        <p><strong>Nombre:</strong> ${facturacion.nombre}</p>
        <p><strong>NIF/CIF:</strong> ${identificadorCliente}</p>
        <p><strong>Dirección:</strong> ${facturacion.direccion}</p>
        <p><strong>Ciudad:</strong> ${facturacion.ciudad}</p>
        <p><strong>CP:</strong> ${facturacion.cp}</p>
        <p><strong>País:</strong> ${facturacion.pais}</p>
        <p><strong>Teléfono:</strong> ${facturacion.telefono}</p>
      </div>

      <div class="section-title">Detalle del pedido</div>
      <table>
        <tr>
          <th>Concepto</th>
          <th>Cantidad</th>
          <th>Base</th>
          <th>IVA (21%)</th>
          <th>Total</th>
        </tr>
        <tr>
          <td>${pago.plugin_id}</td>
          <td>${pago.cantidad_licencias}</td>
          <td>${base} €</td>
          <td>${iva} €</td>
          <td>${total} €</td>
        </tr>
      </table>

      <div class="section-title">Licencias</div>
      <div class="box">
        ${pago.licencias
          .map(
            (l) => `
            <p><strong>Email Tekla:</strong> ${l.email_tekla || "(sin asignar)"}</p>
          `
          )
          .join("")}
      </div>

      <div class="total">
        Total con IVA: ${total} €
      </div>

      <div class="firma">
        <p>Firmado digitalmente por:</p>
        <p><strong>${empresa.nombre}</strong></p>
        <p>CIF/NIF: ${empresa.cif}</p>
      </div>

      <div class="qr">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ombim.com/factura/${pago.id}" />
      </div>

      <div class="footer">
        ${empresa.nombre} — CIF/NIF: ${empresa.cif} — ${empresa.email} — ${empresa.telefono}<br/>
        ${empresa.direccion}, ${empresa.cp} ${empresa.ciudad} (${empresa.pais})
      </div>

    </body>
  </html>
  `;

  // Lanzar Chromium compatible con Vercel
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=factura-${pago.numero_factura}.pdf`,
    },
  });
}
