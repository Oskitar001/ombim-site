import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { pago_id, emails } = await req.json();

  if (!pago_id || !emails?.length) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return NextResponse.json({ error: "NO_LOGIN" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
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

  if (!pago || pago.user_id !== user.id) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  await supabase
    .from("pagos")
    .update({
      emails_tekla: emails,
      estado: "esperando_transferencia"
    })
    .eq("id", pago_id);

  return NextResponse.json({ ok: true });
}
