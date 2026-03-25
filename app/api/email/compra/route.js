import { PLANTILLA_COMPRA } from "@/app/api/email/plantillas/compra";
import { sendEmail } from "@/lib/email";

export async function POST(req) {
  const { email, plugin_nombre, emails_tekla, pago_id, precio } = await req.json();

  const lista = emails_tekla.map((e) => `<li>${e}</li>`).join("");

  const html = PLANTILLA_COMPRA
    .replace("{{plugin_nombre}}", plugin_nombre)
    .replace("{{lista_emails}}", lista)
    .replace("{{pago_id}}", pago_id)
    .replace("{{precio}}", precio)
    .replace("{{cuenta_banco}}", "ES00 0000 0000 0000 0000 0000");

  await sendEmail({
    to: email,
    subject: "Compra recibida – OMBIM",
    html,
  });

  return Response.json({ ok: true });
}