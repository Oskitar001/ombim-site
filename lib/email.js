import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarEmail(to, subject, html) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.error("Error enviando email:", err);
    return false;
  }
}

export function plantillaTransferenciaNotificada(usuario, pagoId) {
  return `
    <div style="font-family: Arial; padding: 20px;">
      <h2>Transferencia notificada</h2>
      <p>El usuario <strong>${usuario}</strong> ha notificado la transferencia del pago:</p>
      <p><strong>ID del pago:</strong> ${pagoId}</p>
    </div>
  `;
}
