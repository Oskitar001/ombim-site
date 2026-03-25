import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_KEY);

export async function sendEmail({ to, subject, html }) {
  await resend.emails.send({
    from: "OMBIM <noreply@ombim.site>",
    to,
    subject,
    html,
  });
}