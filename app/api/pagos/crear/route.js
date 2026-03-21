export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (!session) {
      return NextResponse.json({ error: "NO_LOGIN" }, { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: { headers: { Authorization: `Bearer ${session}` } },
      }
    );

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    const { plugin_id, email, licencias } = await req.json();

    if (!plugin_id || !email || !licencias?.length) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // Calcular cantidad total de licencias
    const cantidad = licencias.reduce((acc, fila) => acc + fila.cantidad, 0);

    // Crear pago
    const { data: pago, error: pagoError } = await supabase
      .from("pagos")
      .insert({
        user_id: user.id,
        plugin_id,
        email_tekla: email,
        cantidad,
        metodo: "transferencia",
        estado: "pendiente"
      })
      .select()
      .single();

    if (pagoError) {
      console.error(pagoError);
      return NextResponse.json({ error: pagoError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, pago_id: pago.id });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
