import { sendEmail } from "@/lib/email";

const TEMPLATE_COMPRA = `
<!DOCTYPE html>
<html lang="es" style="font-family: Arial, sans-serif;">
  <body style="background:#f9fafb;padding:0;margin:0;">
    <div style="max-width:580px;margin:40px auto;background:white;padding:32px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

      <h2 style="color:#1f2937;text-align:center;margin-bottom:20px;">
        Compra recibida – OMBIM
      </h2>

      <p style="font-size:16px;color:#374151;">
        Hola, hemos recibido tu compra del plugin:
      </p>

      <p style="font-size:20px;color:#111827;font-weight:bold;">{{plugin_nombre}}</p>

      <p style="color:#4b5563;font-size:16px;">Emails Tekla asociados:</p>
      <ul style="color:#374151;font-size:15px;">{{lista_emails}}</ul>

      <p style="color:#4b5563;font-size:16px;">
        Para completar la compra, realiza una transferencia bancaria a:
      </p>

      <div style="background:#e5e7eb;padding:12px;border-radius:6px;margin-bottom:16px;">
        <p><strong>Cuenta bancaria:</strong> {{cuenta_banco}}</p>
        <p><strong>Concepto:</strong> Pago OMBIM Nº {{pago_id}}</p>
        <p><strong>Importe:</strong> {{precio}}€</p>
      </div>

      <p style="color:#4b5563;font-size:16px;">
        Una vez validemos la transferencia, activaremos tus licencias y te enviaremos un email.
      </p>

      <hr style="margin:32px 0;border:none;border-top:1px solid #e5e7eb;" />

      <p style="text-align:center;color:#9ca3af;font-size:12px;">
        © OMBIM – Herramientas BIM para Tekla Structures
      </p>
    </div>
  </body>
</html>
`;

export async function POST(req) {
  const { email, plugin_nombre, emails_tekla, pago_id, precio } = await req.json();

  const lista = emails_tekla.map((e) => `<li>${e}</li>`).join("");

  const html = TEMPLATE_COMPRA
    .replace("{{plugin_nombre}}", plugin_nombre)
    .replace("{{lista_emails}}", lista)
    .replace("{{pago_id}}", pago_id)
    .replace("{{precio}}", precio)
    .replace("{{cuenta_banco}}", "ESXX XXXX XXXX XXXX XXXX XXXX"); // tu IBAN

  await sendEmail({
    to: email,
    subject: "Compra recibida – OMBIM",
    html,
  });

  return Response.json({ ok: true });
}