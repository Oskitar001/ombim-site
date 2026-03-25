import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { sendEmail } from "@/lib/email";

const TEMPLATE_TRANSFERENCIA = `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial; background:#f4f4f4; padding:20px;">
    <div style="max-width:600px;margin:auto;background:white;padding:20px;border-radius:6px;">
      <h2>Notificación de transferencia recibida</h2>
      <p>Un usuario ha indicado que ha realizado la transferencia bancaria.</p>
      <p>Por favor verifica el pago en tu banca online.</p>
    </div>
  </body>
</html>
`;

export async function POST(req) {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { pago_id } = await req.json();

  const html = TEMPLATE_TRANSFERENCIA;

  await sendEmail({
    to: "pagos@ombim.site",
    subject: `El usuario ${user.email} indica que ha realizado una transferencia`,
    html,
  });

  return NextResponse.json({ ok: true });
}