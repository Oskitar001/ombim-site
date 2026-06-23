// /lib/pdf2.js — FACTURA OMBIM (AUTOMÁTICO + MANUAL PRO)
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { Writable } from "stream";

class MemoryStream extends Writable {
  constructor() {
    super();
    this.chunks = [];
  }
  _write(chunk, enc, next) {
    this.chunks.push(Buffer.from(chunk));
    next();
  }
  getBuffer() {
    return Buffer.concat(this.chunks);
  }
}

export async function generateInvoicePdf(datos) {
  const {
    pagoId,
    numeroFactura,
    fecha,
    razonSocial,
    nif,
    direccion,
    ciudad,
    cp,
    telefono,
    licencias = [],
    usarRetencion = false,
    manual = false,
    pedidos = [],
  } = datos;

  // =====================
  // CALCULOS
  // =====================
  const subtotal = licencias.reduce(
    (acc, l) => acc + (l.precioUnitario || 0) * (l.cantidad || 1),
    0
  );

  const iva = subtotal * 0.21;
  const retencion = usarRetencion ? subtotal * 0.19 : 0;
  const total = subtotal + iva - retencion;

  // =====================
  // QR
  // =====================
  let qrBuffer = null;

  if (pagoId) {
    const qrUrl = `https://ombim.site/api/facturas/verify?pago_id=${pagoId}`;
    const qrDataUrl = await QRCode.toDataURL(qrUrl);
    qrBuffer = Buffer.from(qrDataUrl.split(",")[1], "base64");
  }

  // =====================
  // PDF
  // =====================
  const memory = new MemoryStream();

  const fontPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "Roboto-VariableFont_wdth,wght.ttf"
  );

  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
    font: fontPath,
  });

  doc.pipe(memory);

  // =====================
  // LOGO + TITULO
  // =====================
  try {
    const logo = path.join(process.cwd(), "public", "logo-ombim.png");
    if (fs.existsSync(logo)) {
      doc.image(logo, 40, 20, { width: 95 });
    }
  } catch {}

  doc
    .fontSize(24) // ✅ reducido
    .fillColor("#000")
    .text("FACTURA", 0, 25, { align: "right" });

  doc
    .fontSize(9) // ✅ reducido
    .fillColor("#444")
    .text(`Fecha: ${fecha}`, { align: "right" })
    .text(`N.º de factura: ${numeroFactura}`, { align: "right" });

  // ✅ PEDIDOS EN COLUMNA
  if (pedidos.length > 0) {
    doc.text("N.º de pedidos:", { align: "right" });

    pedidos.forEach((p) => {
      if (p && p.trim() !== "") {
        doc.text(p, { align: "right" });
      }
    });
  }

  doc.moveDown(2);

  // =====================
  // DATOS
  // =====================
  const topLeft = 120;
  const topRight = 120; // ✅ pequeño ajuste

  // EMPRESA
  doc
    .fontSize(10)
    .fillColor("#000")
    .text("OMBIM — Modelado & API Tekla", 40, topLeft);

  doc
    .fontSize(9)
    .fillColor("#444")
    .text("Oscar Martínez Alonso", 40, topLeft + 15)
    .text("C/ cid, 49-A", 40, topLeft + 30)
    .text("46360 Buñol Valencia", 40, topLeft + 45)
    .text("NIF 73768981T", 40, topLeft + 60)
    .text("Teléfono: 682288465", 40, topLeft + 75);

  // CLIENTE
  doc
    .fontSize(11)
    .fillColor("#000")
    .text(razonSocial || "Cliente", 350, topRight, {
      width: 200,
      align: "right",
    });

  doc
    .fontSize(9)
    .fillColor("#444")
    .text(direccion || "", 350, topRight + 15, {
      width: 200,
      align: "right",
    })
    .text(`${cp || ""} ${ciudad || ""}`, 350, topRight + 45, {
      width: 200,
      align: "right",
      lineBreak: false,
    })

    .text(`NIF: ${nif || ""}`, 350, topRight + 60, {
      width: 200,
      align: "right",
    })
    .text(`Teléfono: ${telefono || ""}`, 350, topRight + 75, {
      width: 200,
      align: "right",
    });

  doc.moveDown(4);

  // =====================
  // TABLA
  // =====================
  const headerY = doc.y + 10;
  const rowHeight = 24;

  doc.rect(40, headerY, 520, rowHeight).fill("#F3F4F6");

  doc
    .fillColor("#000")
    .fontSize(10)
    .text("DESCRIPCIÓN", 45, headerY + 7, { width: 230 })
    .text("PRECIO UD", 280, headerY + 7, { width: 80, align: "right" })
    .text("CANTIDAD", 360, headerY + 7, { width: 80, align: "right" })
    .text("IMPORTE", 450, headerY + 7, { width: 110, align: "right" });

  let y = headerY + rowHeight + 5;

  licencias.forEach((l, index) => {
    const descripcion = l.nombrePlugin || l.tipo || "Concepto";
    const cantidad = l.cantidad || 1;
    const importe = (l.precioUnitario || 0) * cantidad;

    const bg = index % 2 === 0 ? "#FFFFFF" : "#F9FAFB";

    doc.rect(40, y, 520, rowHeight).fill(bg);

    doc
      .fillColor("#222")
      .fontSize(9)
      .text(descripcion, 45, y + 6, { width: 230 })
      .text(`${l.precioUnitario.toFixed(2)} €`, 280, y + 6, {
        width: 80,
        align: "right",
      })
      .text(cantidad.toString(), 360, y + 6, {
        width: 80,
        align: "right",
      })
      .text(`${importe.toFixed(2)} €`, 450, y + 6, {
        width: 110,
        align: "right",
      });

    y += rowHeight + 5;
  });

  // =====================
  // TOTALES
  // =====================
  doc.y = y + 30;

  const totalsX = 350;
  let totalsY = doc.y;

  doc.rect(totalsX - 10, totalsY - 8, 220, usarRetencion ? 90 : 70).fill("#F3F4F6");

  doc
    .fontSize(10)
    .fillColor("#444")
    .text("SUBTOTAL:", totalsX, totalsY)
    .text(`${subtotal.toFixed(2)} €`, totalsX + 100, totalsY, { align: "right" });

  totalsY += 18;

  doc
    .text("IVA 21%:", totalsX, totalsY)
    .text(`${iva.toFixed(2)} €`, totalsX + 100, totalsY, { align: "right" });

  totalsY += 18;

  if (usarRetencion) {
    doc
      .text("RET 19%:", totalsX, totalsY)
      .text(`-${retencion.toFixed(2)} €`, totalsX + 100, totalsY, {
        align: "right",
      });

    totalsY += 18;
  }

  doc.moveTo(totalsX - 10, totalsY).lineTo(totalsX + 210, totalsY).stroke();

  totalsY += 8;

  doc
    .fontSize(12)
    .fillColor("#000")
    .text("TOTAL:", totalsX, totalsY)
    .text(`${total.toFixed(2)} €`, totalsX + 100, totalsY, {
      align: "right",
    });

  doc.moveDown(4);

  // =====================
  // PIE
  // =====================
  const pieTexto =
    "Forma de pago por transferencia bancaria a la cuenta\n" +
    "ES6000492851140274135574\n" +
    "Si tiene cualquier tipo de pregunta sobre esta factura, póngase en contacto.";

  doc.fontSize(9).fillColor("#444").text(pieTexto, 40, doc.y);

  if (qrBuffer && !manual) {
    doc.rect(40, doc.y + 55, 110, 110).stroke();
    doc.image(qrBuffer, 45, doc.y + 60, { width: 100 });
  }

  doc.moveDown(12);

  doc
    .fontSize(9)
    .fillColor("#777")
    .text("GRACIAS POR SU CONFIANZA", { align: "center" });

  doc.end();

  return new Promise((resolve) => {
    memory.on("finish", () => resolve(memory.getBuffer()));
  });
}