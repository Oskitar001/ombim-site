import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/checkAdmin";
import { enviarEmail } from "@/lib/email";

export async function POST(req) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const { pago_id } = body;

  if (!pago_id) {
    return NextResponse.json({ error: "Falta pago_id" }, { status: 400 });
  }

  const { data: pago, error: pagoError } = await supabaseAdmin
    .from("pagos")
    .select("*, licencias(*)")
    .eq("id", pago_id)
    .single();

  if (pagoError || !pago) {
    return NextResponse.json(
      { error: "No se encontró el pago" },
      { status: 404 }
    );
  }

  await supabaseAdmin
    .from("pagos")
    .update({ estado: "aprobado" })
    .eq("id", pago_id);

  await supabaseAdmin
    .from("licencias")
    .update({ estado: "activa" })
    .eq("pago_id", pago_id);

  const { data: userRes } = await supabaseAdmin.auth.admin.getUserById(
    pago.user_id
  );

  const emailsTekla = (pago.licencias || []).map((l) => l.email_tekla);

  const html = `
    <div style="font-family: Arial; padding: 20px;">
      <h2>Tus licencias han sido activadas</h2>
      <p>Se han activado las licencias para los siguientes emails de Tekla:</p>
      <ul>
        ${emailsTekla.map((e) => `<li>${e}</li>`).join("")}
      </ul>
      <p>Gracias por confiar en OMBIM.</p>
    </div>
  `;

  if (userRes?.user?.email) {
    await enviarEmail(userRes.user.email, "Licencias activadas", html);
  }

  return NextResponse.json({ ok: true });
}
