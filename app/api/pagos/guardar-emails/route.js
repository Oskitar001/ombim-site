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

  // Validar emails
  for (const entry of emails) {
    if (!entry.email_tekla || entry.email_tekla.trim() === "") {
      return NextResponse.json(
        { error: "Todos los emails deben estar completos" },
        { status: 400 }
      );
    }
  }

  // Preparar batch update
  const updates = emails.map((entry) => ({
    id: entry.licencia_id,
    email_tekla: entry.email_tekla.trim(),
  }));

  // Actualizar licencias
  const { error } = await supabaseAdmin
    .from("licencias")
    .upsert(updates, {
      onConflict: "id",
    });

  if (error) {
    console.error("❌ Error guardando emails:", error);
    return NextResponse.json(
      { error: "error_guardando_emails" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}