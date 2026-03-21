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

export function plantillaLicenciasActivadas(emails) {
  return `
    <div style="font-family: Arial; padding: 20px;">
      <h2 style="color: #4CAF50;">Tus licencias están activas</h2>
      <p>Se han activado las licencias para los siguientes emails de Tekla:</p>
      <ul>
        ${emails.map((e) => `<li>${e}</li>`).join("")}
      </ul>
      <p>Gracias por confiar en OMBIM.</p>
    </div>
  `;
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
