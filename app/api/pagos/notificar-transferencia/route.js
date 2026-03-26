// app/api/pagos/notificar-transferencia/route.js
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendEmail } from "@/lib/email";

export async function POST(req) {
  const { pago_id } = await req.json();
  if (!pago_id) return NextResponse.json({ error: "Falta pago_id" }, { status: 400 });

  // Cliente Supabase correcto para Next.js 16
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
      },
    }
  );

  // Usuario logueado
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  // Recuperar email de empresa
  const { data: empresa } = await supabaseAdmin
    .from("empresa")
    .select("email,nombre")
    .eq("id", 1)
    .single();

  const destino = empresa?.email ?? "o.martinez@ombim.com";

  const html = `
    <h2>Notificación de transferencia recibida</h2>
    <p>El usuario <strong>${user.email}</strong> ha indicado que ya ha realizado la transferencia bancaria.</p>
    <p><strong>Pago ID:</strong> ${pago_id}</p>
    <p>Revisa la banca online y activa las licencias cuando lo confirmes.</p>
  `;

  await sendEmail({
    to: destino,
    subject: `Transferencia recibida – Pago ${pago_id}`,
    html,
  });

  return NextResponse.json({ ok: true });
}