import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const { pago_id } = await req.json();

  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: { headers: { Authorization: `Bearer ${session}` } },
    }
  );

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  const { data: pago } = await supabase
    .from("pagos")
    .select("*")
    .eq("id", pago_id)
    .single();

  if (pago.user_id !== user.id)
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  await supabase
    .from("pagos")
    .update({ estado: "transferencia_notificada" })
    .eq("id", pago_id);

  await resend.emails.send({
    from: "OMBIM <noreply@ombim.com>",
    to: "o.martinez@ombim.com",
    subject: `Transferencia notificada - Pago ${pago_id}`,
    html: `<p>El usuario ${user.email} ha marcado el pago como transferido.</p>`,
  });

  return NextResponse.json({ ok: true });
}
