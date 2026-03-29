// /lib/pdf.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import QRCode from "qrcode";

/**
 * datos = {
 *   pagoId,
 *   numeroFactura,
 *   fecha,
 *   razonSocial,
 *   nif,
 *   direccion,
 *   ciudad,
 *   cp,
 *   pais,
 *   telefono,
 *   email,
 *   licencias: [
 *      { email: "x@tekla.com", tipo: "completa", precioUnitario: 59 },
 *      ...
 *   ]
 * }
 */
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

  // ================================
  //   CALCULAR TOTAL, SUBTOTAL, IVA
  // ================================
  const subtotal = licencias.reduce((acc, l) => acc + (l.precioUnitario || 0), 0);
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  // ================================
  //   GENERAR QR
  // ================================
  const urlVerificacion = `https://ombim.site/api/facturas/verify?pago_id=${pagoId}`;

  const qrDataUrl = await QRCode.toDataURL(urlVerificacion);

  // ================================
  //   INICIAR PDF
  // ================================
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const stream = new Readable({ read() {} });
  doc.pipe(stream);

  // ================================
  //   LOGO
  // ================================
  try {
    const logoPath = path.join(process.cwd(), "public", "logo-ombim.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 40, { width: 120 });
    }
  } catch {}

  doc.moveDown(4);

  // ================================
  //   CABECERA FACTURA
  // ================================
  doc
    .fontSize(24)
    .fillColor("#333")
    .text("FACTURA", { align: "left" })
    .moveDown(0.5);

  doc
    .fontSize(10)
    .fillColor("#555")
    .text("OMBIM — Modelado 3D y software para Tekla Structures")
    .moveDown(1.2);

  // Divisor
  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .lineWidth(1)
    .strokeColor("#CCCCCC")
    .stroke();

  doc.moveDown(1.5);

  // ================================
  //   DATOS FACTURA
  // ================================
  doc.fontSize(13).fillColor("#000").text("Datos de la factura", { underline: true });
  doc.moveDown(0.8);

  const datosFactura = [
    ["Número:", numeroFactura ?? "-"],
    ["Fecha:", fecha ?? "-"]
  ];

  datosFactura.forEach(([label, value]) => {
    doc.font("Helvetica-Bold").text(label, { continued: true });
    doc.font("Helvetica").text(` ${value}`);
  });

  doc.moveDown(1.5);

  // ================================
  //   DATOS CLIENTE
  // ================================
  doc.fontSize(13).fillColor("#000").text("Datos del cliente", { underline: true });
  doc.moveDown(0.8);

  const cliente = [
    ["Razón social:", razonSocial ?? "-"],
    ["NIF/CIF:", nif ?? "-"],
    ["Dirección:", direccion ?? "-"],
    ["Ciudad:", ciudad ?? "-"],
    ["CP:", cp ?? "-"],
    ["País:", pais ?? "-"],
    ["Teléfono:", telefono ?? "-"],
    ["Email:", email ?? "-"],
  ];

  cliente.forEach(([label, value]) => {
    doc.font("Helvetica-Bold").text(label, { continued: true });
    doc.font("Helvetica").text(` ${value}`);
  });

  doc.moveDown(2);

  // ================================
  //   LICENCIAS (DESGLOSE)
  // ================================
  doc.fontSize(13).fillColor("#000").text("Desglose de licencias", { underline: true });
  doc.moveDown(1);

  const startX = 50;
  const endX = 550;

  // Encabezado tabla
  doc.font("Helvetica-Bold").fontSize(11)
    .text("Email Tekla", startX, doc.y, { width: 200 })
    .text("Tipo", startX + 200, doc.y, { width: 100 })
    .text("Precio (€)", endX - 80, doc.y, { width: 80, align: "right" });

  doc.moveDown(0.3);

  // Separador
  doc
    .moveTo(startX, doc.y)
    .lineTo(endX, doc.y)
    .lineWidth(1)
    .strokeColor("#AAAAAA")
    .stroke();

  doc.moveDown(0.5);

  // Filas de la tabla
  doc.font("Helvetica").fontSize(11);
  licencias.forEach((l) => {
    doc.text(l.email, startX, doc.y, { width: 200 })
      .text(l.tipo, startX + 200, doc.y, { width: 100 })
      .text(`${l.precioUnitario.toFixed(2)} €`, endX - 80, doc.y, { width: 80, align: "right" });
  });

  doc.moveDown(2);

  // ================================
  //   SUBTOTAL / IVA / TOTAL
  // ================================
  doc.font("Helvetica-Bold").fontSize(12);
  doc.text("Subtotal:", startX, doc.y, { continued: true });
  doc.text(` ${(subtotal).toFixed(2)} €`, { align: "right" });

  doc.text("IVA 21%:", startX, doc.y, { continued: true });
  doc.text(` ${(iva).toFixed(2)} €`, { align: "right" });

  doc.fontSize(14).fillColor("#000");
  doc.text("TOTAL:", startX, doc.y, { continued: true });
  doc.text(` ${(total).toFixed(2)} €`, { align: "right" });

  doc.moveDown(3);

  // ================================
  //   QR — VERIFICACIÓN
  // ================================
  doc.font("Helvetica-Bold").fontSize(11).text("Verificación de la factura:");
  doc.moveDown(0.5);

  try {
    const qrBase64 = qrDataUrl.replace(/^data:image\/png;base64,/, "");
    const qrBuffer = Buffer.from(qrBase64, "base64");
    doc.image(qrBuffer, startX, doc.y, { width: 120 });
  } catch (err) {
    doc.fontSize(10).fillColor("red").text("Error generando el QR");
  }

  doc.moveDown(6);

  // ================================
  //   PIE DE PÁGINA
  // ================================
  doc.fontSize(9).fillColor("#666")
    .text("Factura generada automáticamente por OMBIM.", { align: "center" })
    .text("Para cualquier duda: info@ombim.com", { align: "center" });

  doc.end();
  return stream;
}