// /lib/pdf2.js — FACTURA OMBIM (alineada + tabla premium + totales premium)
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { Writable } from "stream";
import QRCode from "qrcode";

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

  // =====================
  // QR
  // =====================
  const qrUrl = `https://ombim.site/api/facturas/verify?pago_id=${pagoId}`;
  const qrDataUrl = await QRCode.toDataURL(qrUrl);
  const qrBuffer = Buffer.from(qrDataUrl.split(",")[1], "base64");

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
    font: fontPath
  });

  doc.pipe(memory);

  const lightGray = "#E5E7EB";

  // =====================
  // LOGO + TÍTULO
  // =====================
  try {
    const logo = path.join(process.cwd(), "public", "logo-ombim.png");
    if (fs.existsSync(logo)) {
      doc.image(logo, 40, 20, { width: 95 });
    }
  } catch {}

  doc
    .fontSize(28)
    .fillColor("#000")
    .text("FACTURA", 0, 25, { align: "right" });

  doc
    .fontSize(11)
    .fillColor("#444")
    .text(`Fecha: ${fecha}`, { align: "right" })
    .text(`N.º de factura: ${numeroFactura}`, { align: "right" });

  doc.moveDown(2);

  // =====================
  // BLOQUE IZQUIERDO: TUS DATOS
  // =====================
  const topLeft = 110;
  const topRight = 110;

  doc
    .fontSize(12)
    .fillColor("#000")
    .text("OMBIM — Modelado & API Tekla", 40, topLeft);

  doc
    .fontSize(10)
    .fillColor("#444")
    .text("Oscar Martínez Alonso", 40, topLeft + 15)
    .text("C/D, 49-A", 40, topLeft + 30)
    .text("46360 Buñol Valencia", 40, topLeft + 45)
    .text("NIF 73769891T", 40, topLeft + 60)
    .text("Teléfono: 682828465", 40, topLeft + 75);

  // =====================
  // BLOQUE DERECHO: DATOS CLIENTE
  // =====================
  doc
    .fontSize(12)
    .fillColor("#000")
    .text(razonSocial || "Cliente", 350, topRight, {
      width: 200,
      align: "right",
    });

  doc
    .fontSize(10)
    .fillColor("#444")
    .text(direccion || "", 350, topRight + 15, { width: 200, align: "right" })
    .text(`${cp || ""} ${ciudad || ""}`, 350, topRight + 30, {
      width: 200,
      align: "right",
    })
    .text(`NIF: ${nif || ""}`, 350, topRight + 45, {
      width: 200,
      align: "right",
    })
    .text(`Teléfono: ${telefono || ""}`, 350, topRight + 60, {
      width: 200,
      align: "right",
    });

  doc.moveDown(4);

  // =====================
  // TABLA PREMIUM (HEADER)
  // =====================
  const headerY = doc.y + 10;
  const rowHeight = 24;

  doc
    .rect(40, headerY, 520, rowHeight)
    .fill("#F3F4F6");

  doc
    .fillColor("#000")
    .fontSize(11)
    .text("DESCRIPCIÓN", 45, headerY + 7, { width: 230 })
    .text("PRECIO UD", 280, headerY + 7, { width: 80, align: "right" })
    .text("CANTIDAD", 360, headerY + 7, { width: 80, align: "right" })
    .text("IMPORTE", 450, headerY + 7, { width: 110, align: "right" });

  const lineY = headerY + rowHeight;
  doc
    .moveTo(40, lineY)
    .lineTo(560, lineY)
    .strokeColor("#CCCCCC")
    .lineWidth(1)
    .stroke();

  let y = lineY + 5;

  doc.fontSize(10).fillColor("#111");

  licencias.forEach((l, index) => {
    const descripcion = l.nombrePlugin || l.tipo || "Licencia";
    const bg = index % 2 === 0 ? "#FFFFFF" : "#F9FAFB";

    doc
      .rect(40, y, 520, rowHeight)
      .fill(bg);

    doc
      .fillColor("#222")
      .text(descripcion, 45, y + 6, { width: 230 })
      .text(`${l.precioUnitario.toFixed(2)} €`, 280, y + 6, {
        width: 80,
        align: "right",
      })
      .text("1", 360, y + 6, {
        width: 80,
        align: "right",
      })
      .text(`${l.precioUnitario.toFixed(2)} €`, 450, y + 6, {
        width: 110,
        align: "right",
      });

    y += rowHeight;

    doc
      .moveTo(40, y)
      .lineTo(560, y)
      .strokeColor("#ECECEC")
      .lineWidth(0.5)
      .stroke();

    y += 5;
  });

  // =====================
  // TOTALES PREMIUM
  // =====================
  doc.y = y + 30;

  const totalsX = 350;
  let totalsY = doc.y;

  doc
    .rect(totalsX - 10, totalsY - 8, 220, 70)
    .fill("#F3F4F6");

  doc
    .font(fontPath)
    .fontSize(11)
    .fillColor("#444")
    .text("SUBTOTAL:", totalsX, totalsY, { width: 100 })
    .text(`${subtotal.toFixed(2)} €`, totalsX + 100, totalsY, {
      width: 100,
      align: "right",
    });

  totalsY += 18;

  doc
    .text("IVA 21%:", totalsX, totalsY, { width: 100 })
    .text(`${iva.toFixed(2)} €`, totalsX + 100, totalsY, {
      width: 100,
      align: "right",
    });

  totalsY += 18;

  doc
    .moveTo(totalsX - 10, totalsY)
    .lineTo(totalsX + 210, totalsY)
    .strokeColor("#CCC")
    .lineWidth(1)
    .stroke();

  totalsY += 8;

  doc
    .font(fontPath)
    .fontSize(13)
    .fillColor("#000")
    .text("TOTAL:", totalsX, totalsY, { width: 100 })
    .text(`${total.toFixed(2)} €`, totalsX + 100, totalsY, {
      width: 100,
      align: "right",
    });

  doc.moveDown(4);

  // =====================
  // PIE + QR
  // =====================
  const pieTexto =
    "Forma de pago por transferencia bancaria a la cuenta\n" +
    "ES6000492851140274135574\n" +
    "Si tiene cualquier tipo de pregunta sobre esta factura, póngase en contacto.";

  doc
    .fontSize(10)
    .fillColor("#444")
    .text(pieTexto, 40, doc.y);

  doc
    .rect(40, doc.y + 55, 110, 110)
    .strokeColor("#888")
    .lineWidth(1)
    .stroke();

  doc.image(qrBuffer, 45, doc.y + 60, { width: 100 });

  doc.moveDown(12);

  doc
    .fontSize(10)
    .fillColor("#777")
    .text("GRACIAS POR SU CONFIANZA", { align: "center" });

  doc.end();

  return new Promise((resolve) => {
    memory.on("finish", () => resolve(memory.getBuffer()));
  });
}
