export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import checkAdmin from "@/lib/checkAdmin";
import { Resend } from "resend";
import { logAdmin } from "@/lib/logAdmin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req, { params }) {
  try {
    // 1. Validar admin
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const pago_id = params.id;

    // 2. Cliente Supabase con SERVICE ROLE
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 3. Obtener pago
    const { data: pago, error: pagoError } = await supabase
      .from("pagos")
      .select("*")
      .eq("id", pago_id)
      .single();

    if (pagoError || !pago) {
      return NextResponse.json({ error: "PAGO_NO_ENCONTRADO" }, { status: 404 });
    }

    // 4. Validar emails Tekla
    const emails = pago.emails_tekla;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: "SIN_EMAILS_TEKLA" },
        { status: 400 }
      );
    }

    // 5. Crear licencias (una por email)
    for (const email of emails) {
      const { error: licError } = await supabase
        .from("licencias")
        .insert({
          email_tekla: email,
          plugin_id: pago.plugin_id,
          tipo_id: null, // si quieres usar tipos, aquí lo asignas
          estado: "activa",
          max_activaciones: 3,
          user_id: pago.user_id
        });

      if (licError) {
        console.error(licError);
        return NextResponse.json(
          { error: "ERROR_CREANDO_LICENCIAS" },
          { status: 500 }
        );
      }
    }

    // 6. Marcar pago como completado
    await supabase
      .from("pagos")
      .update({ estado: "completado" })
      .eq("id", pago_id);

    // 7. Email al usuario (opcional)
    if (pago.email_tekla) {
      await resend.emails.send({
        from: "OMBIM <noreply@tudominio.com>",
        to: pago.email_tekla,
        subject: "Tus licencias están activas",
        html: `
          <h1>Licencias activadas</h1>
          <p>Hemos activado tus licencias para los siguientes emails de Tekla:</p>
          <ul>
            ${emails.map((e) => `<li>${e}</li>`).join("")}
          </ul>
        `,
      });
    }

    // 8. Log admin
    await logAdmin({
      tipo: "PAGO_APROBADO",
      mensaje: `Pago ${pago_id} aprobado. Emails: ${emails.join(", ")}`,
      user_id: pago.user_id,
    });

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "ERROR_INTERNO" }, { status: 500 });
  }
}
