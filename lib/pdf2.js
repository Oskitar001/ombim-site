// /lib/pdf2.js — Estilo C (SaaS Premium)
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { Writable } from "stream";
import QRCode from "qrcode";

// Memory stream para alojar PDF
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
    pais,
    telefono,
    email,
    licencias = []
  } = datos;

  const subtotal = licencias.reduce((acc, l) => acc + (l.precioUnitario || 0), 0);
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  // QR
  const qrUrl = `https://ombim.site/api/facturas/verify?pago_id=${pagoId}`;
  const qrDataUrl = await QRCode.toDataURL(qrUrl);
  const qrBuffer = Buffer.from(qrDataUrl.split(",")[1], "base64");

  const fontPath = path.join(
    process.cwd(),
    "public",
    "fonts",
    "Roboto-VariableFont_wdth,wght.ttf"
  );

  const memory = new MemoryStream();

  const doc = new PDFDocument({
    size: "A4",
    margin: 40,
    font: fontPath
  });

  doc.pipe(memory);

  // ============= CABECERA PREMIUM =============
  const blue = "#1D4ED8"; // azul OMBIM
  
  try {
    const logo = path.join(process.cwd(), "public", "logo-ombim.png");
    if (fs.existsSync(logo)) {
      doc.image(logo, 40, 40, { width: 120 });
    }
  } catch {}

  doc
    .fillColor(blue)
    .fontSize(26)
    .text("Factura", 0, 40, { align: "right" });

  doc
    .fontSize(12)
    .fillColor("#444")
    .text(`Factura Nº: ${numeroFactura}`, { align: "right" })
    .text(`Fecha: ${fecha}`, { align: "right" });

  doc.moveDown(2);

  // ============= SECCIÓN CLIENTE =============
  doc
    .fillColor("#000")
    .fontSize(15)
    .text("Datos del cliente", { bold: true });

  doc.moveDown(0.5);

  const cliente = [
    ["Razón social", razonSocial],
    ["NIF", nif],
    ["Dirección", direccion],
    ["Ciudad", ciudad],
    ["CP", cp],
    ["País", pais],
    ["Teléfono", telefono],
    ["Email", email],
  ];

  cliente.forEach(([l, v]) => {
    doc.fontSize(11).fillColor("#333").text(`${l}: ${v || "—"}`);
  });

  doc.moveDown(2);

  // ============= DESGLOSE PREMIUM =============
  doc
    .fontSize(15)
    .fillColor("#000")
    .text("Licencias adquiridas");

  doc.moveDown(0.7);

  const tableX = 40;
  const tableWidth = 520;

  // Header premium
  doc
    .rect(tableX, doc.y, tableWidth, 26)
    .fill(blue);

  doc
    .fillColor("white")
    .fontSize(11)
    .text("Email Tekla", tableX + 10, doc.y + 7, { width: 200 })
    .text("Tipo", tableX + 210, doc.y + 7, { width: 150 })
    .text("Precio (€)", tableX + 360, doc.y + 7, { align: "right", width: 150 });

  doc.moveDown(2);
  let y = doc.y;

  licencias.forEach((l, i) => {
    const bg = i % 2 === 0 ? "#F3F4F6" : "#FFFFFF";

    doc
      .rect(tableX, y, tableWidth, 24)
      .fill(bg);

    doc
      .fillColor("#111")
      .fontSize(11)
      .text(l.email, tableX + 10, y + 6, { width: 200 })
      .text(l.tipo, tableX + 210, y + 6, { width: 150 })
      .text(`${l.precioUnitario.toFixed(2)} €`, tableX + 360, y + 6, {
        width: 150,
        align: "right",
      });

    y += 24;
  });

  doc.moveDown(2);

  // ============= TOTALES PREMIUM =============
  doc
    .fillColor("#000")
    .fontSize(14)
    .text("Resumen", { align: "right" });

  doc
    .fontSize(12)
    .fillColor("#444")
    .text(`Subtotal: ${subtotal.toFixed(2)} €`, { align: "right" })
    .text(`IVA 21%: ${iva.toFixed(2)} €`, { align: "right" })
    .text(`TOTAL: ${total.toFixed(2)} €`, { align: "right" })
    .moveDown(2);

  // ============= QR PREMIUM =============
  doc
    .fontSize(12)
    .fillColor("#000")
    .text("Verificación", { align: "left" });

  doc.moveDown(0.5);

  doc
    .rect(40, doc.y, 130, 130)
    .strokeColor(blue)
    .lineWidth(2)
    .stroke();

  doc.image(qrBuffer, 45, doc.y + 5, { width: 120 });

  doc.moveDown(10);

  // Pie de página
  doc
    .fontSize(10)
    .fillColor("#555")
    .text("Factura generada automáticamente por OMBIM.", {
      align: "center",
    });

  doc.end();

  return new Promise((resolve) => {
    memory.on("finish", () => {
      resolve(memory.getBuffer());
    });
  });
}