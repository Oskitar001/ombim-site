export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkAdmin } from "@/lib/checkAdmin";
import { Resend } from "resend";
import { logAdminAction } from "@/lib/logAdmin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req, { params }) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const pago_id = params.id;

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: pago } = await supabase
      .from("pagos")
      .select("*")
      .eq("id", pago_id)
      .single();

    if (!pago) {
      return NextResponse.json({ error: "PAGO_NO_ENCONTRADO" }, { status: 404 });
    }

    const emails = pago.emails_tekla;
    if (!emails || !emails.length) {
      return NextResponse.json({ error: "SIN_EMAILS_TEKLA" }, { status: 400 });
    }

    for (const email of emails) {
      await supabase.from("licencias").insert({
        email_tekla: email,
        plugin_id: pago.plugin_id,
        estado: "activa",
        max_activaciones: 3,
        user_id: pago.user_id
      });
    }

    await supabase
      .from("pagos")
      .update({ estado: "completado" })
      .eq("id", pago_id);

    await logAdminAction({
      tipo: "PAGO_APROBADO",
      mensaje: `Pago ${pago_id} aprobado. Emails: ${emails.join(", ")}`,
      user_id: pago.user_id
    });

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "ERROR_INTERNO" }, { status: 500 });
  }
}
