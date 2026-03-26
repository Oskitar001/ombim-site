// /lib/email.js
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_KEY);

export async function sendEmail({ to, subject, html }) {
  try {
    return await resend.emails.send({
      from: "OMBIM <noreply@updates.ombim.com>",   // 💥 DOMINIO VERIFICADO
      reply_to: "o.martinez@ombim.com",            // 💥 RESPONDERÁN A TU EMAIL REAL
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Error enviando email:", err);
    return { error: true, err };
  }
}