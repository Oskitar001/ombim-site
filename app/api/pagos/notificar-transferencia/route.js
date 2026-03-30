// app/api/pagos/notificar-transferencia/route.js
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { sendEmail } from "@/lib/email";
import { cookies } from "next/headers";

export async function POST(req) {
  const { pago_id } = await req.json();
  if (!pago_id)
    return NextResponse.json({ error: "Falta pago_id" }, { status: 400 });

  // ✔ FIX: usar cookies() de Next.js 16 (req.cookies no es válido)
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Usuario logueado
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  // Recuperar email de empresa
  const { data: empresa } = await supabaseAdmin
    .from("empresa")
    .select("email,nombre")
    .eq("id", 1)
    .single();

  const destino = empresa?.email ?? "o.martinez@ombim.com";

  // ✔ FIX: HTML limpio (sin entidades)
  const html = `
    <h2>Notificación de transferencia recibida</h2>
    <p>El usuario <strong>${user.email}</strong> ha indicado que ya ha realizado la transferencia bancaria.</p>
    <p><strong>Pago ID:</strong> ${pago_id}</p>
    <p>Revisa la banca online y activa las licencias cuando lo confirmes.</p>
  `;

  const emailRes = await sendEmail({
    to: destino,
    subject: `Transferencia recibida – Pago ${pago_id}`,
    html,
  });

  // ✔ FIX: manejo de error de Resend
  if (emailRes?.error) {
    return NextResponse.json(
      { error: "error_enviando_email" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}