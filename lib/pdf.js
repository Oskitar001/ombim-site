// /lib/pdf.js
import pdfNode from "html-pdf-node";

export async function pdf(html) {
  const file = { content: html };
  const options = {
    format: "A4",
  };

  const buffer = await pdfNode.generatePdf(file, options);
  return buffer;
}