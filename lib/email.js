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
