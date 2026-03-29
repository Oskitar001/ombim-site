// app/api/pagos/guardar-emails/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const { pago_id, emails } = await req.json();

  if (!pago_id || !emails?.length) {
    return NextResponse.json(
      { error: "Datos incompletos" },
      { status: 400 }
    );
  }

  // Validación de emails
  for (const entry of emails) {
    if (!entry.email_tekla || entry.email_tekla.trim() === "") {
      return NextResponse.json(
        { error: "Todos los emails deben estar completos" },
        { status: 400 }
      );
    }
  }

  // 1️⃣ Eliminar emails anteriores del pago
  const { error: deleteErr } = await supabaseAdmin
    .from("pagos_emails")
    .delete()
    .eq("pago_id", pago_id);

  if (deleteErr) {
    console.error("❌ Error eliminando emails previos:", deleteErr);
    return NextResponse.json(
      { error: "error_eliminando", detalle: deleteErr.message },
      { status: 500 }
    );
  }

  // 2️⃣ Insertar los nuevos emails (ON CONFLICT ahora funciona gracias al UNIQUE)
  const inserts = emails.map((e) => ({
    pago_id,
    email_tekla: e.email_tekla.trim(),
  }));

  const { error: insertErr } = await supabaseAdmin
    .from("pagos_emails")
    .upsert(inserts, {
      onConflict: "pago_id,email_tekla"
    });

  if (insertErr) {
    console.error("❌ Error guardando emails:", insertErr);
    return NextResponse.json(
      { error: "error_guardando_emails", detalle: insertErr.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}