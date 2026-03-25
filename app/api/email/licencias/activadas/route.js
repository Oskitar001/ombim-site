import { sendEmail } from "@/lib/email";

const TEMPLATE_ACTIVADAS = `
<!DOCTYPE html>
<html lang="es" style="font-family:Arial;">
  <body style="background:#f3f4f6;padding:0;margin:0;">

    <div style="max-width:580px;margin:40px auto;background:white;padding:32px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

      <h2 style="text-align:center;color:#111827;margin-bottom:20px;">
        Tus licencias OMBIM han sido activadas
      </h2>

      <p style="font-size:16px;color:#374151;">
        Hola, tu compra ha sido validada y ya puedes usar tus plugins de OMBIM.
      </p>

      <p style="font-size:16px;color:#4b5563;">
        Emails Tekla activados:
      </p>

      <ul style="color:#374151;font-size:15px;">
        {{lista_emails}}
      </ul>

      <p style="font-size:16px;color:#4b5563;">
        Si ya tienes el plugin instalado, ábrelo para validar la licencia automáticamente.
      </p>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;" />

      <p style="text-align:center;color:#9ca3af;font-size:12px;">
        © OMBIM – Herramientas BIM profesionales
      </p>

    </div>
  </body>
</html>
`;

export async function POST(req) {
  const { email, emails_tekla } = await req.json();

  const lista = emails_tekla.map((e) => `<li>${e}</li>`).join("");

  const html = TEMPLATE_ACTIVADAS.replace("{{lista_emails}}", lista);

  await sendEmail({
    to: email,
    subject: "Tus licencias OMBIM han sido activadas",
    html,
  });

  return Response.json({ ok: true });
}