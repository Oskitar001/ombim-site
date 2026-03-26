// /lib/email.js
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_KEY);

export async function sendEmail({ to, subject, html }) {
  try {
    return await resend.emails.send({
      from: "OMBIM <o.martinez@ombim.com>",   // 💥 AHORA SÍ FUNCIONA
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("Error enviando email:", err);
    throw err;
  }
}