export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    // 1. Leer cookie de sesión
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;

    if (!session) {
      return NextResponse.json({ error: "NO_LOGIN" }, { status: 401 });
    }

    // 2. Crear cliente Supabase con el token del usuario
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${session}`
          }
        }
      }
    );

    // 3. Obtener usuario REAL de Supabase
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      return NextResponse.json({ error: "NO_LOGIN" }, { status: 401 });
    }

    const user = userData.user;

    // 4. Leer datos enviados por el formulario
    const { plugin_id, email, licencias } = await req.json();

    if (!plugin_id || !email || !licencias?.length) {
      return NextResponse.json(
        { error: "Datos incompletos" },
        { status: 400 }
      );
    }

    // 5. Crear el pago
    const { data: pago, error: pagoError } = await supabase
      .from("pagos")
      .insert({
        user_id: user.id,
        plugin_id,
        email_tekla: email,
        metodo: "transferencia",
        estado: "pendiente"
      })
      .select()
      .single();

    if (pagoError) {
      console.error(pagoError);
      return NextResponse.json({ error: pagoError.message }, { status: 500 });
    }

    // 6. Crear licencias asociadas
    for (const fila of licencias) {
      const { tipo_id, cantidad } = fila;

      for (let i = 0; i < cantidad; i++) {
        const { error: licError } = await supabase
          .from("licencias")
          .insert({
            email_tekla: email,
            plugin_id,
            tipo_id,
            estado: "pendiente", // ← CORREGIDO
            max_activaciones: 3
          });

        if (licError) {
          console.error(licError);
          return NextResponse.json(
            { error: licError.message },
            { status: 500 }
          );
        }
      }
    }

    // 7. Respuesta final
    return NextResponse.json({ ok: true, pago_id: pago.id });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
