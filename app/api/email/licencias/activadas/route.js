import { PLANTILLA_ACTIVADAS } from "@/app/api/email/plantillas/activadas";
import { sendEmail } from "@/lib/email";

export async function POST(req) {
  const { email, emails_tekla } = await req.json();

  const lista = emails_tekla.map((e) => `<li>${e}</li>`).join("");

  const html = PLANTILLA_ACTIVADAS.replace("{{lista_emails}}", lista);

  await sendEmail({
    to: email,
    subject: "Tus licencias OMBIM han sido activadas",
    html,
  });

  return Response.json({ ok: true });
}