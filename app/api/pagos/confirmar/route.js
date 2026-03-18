import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { Resend } from "resend";

// Generador de claves
function generarClave() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bloque = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

  return `OMBIM-${bloque()}-${bloque()}-${bloque()}`;
}

export async function POST(req) {
  try {
    const { pago_id } = await req.json();

    const cookieStore = await cookies();
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${cookieStore.get("sb-access-token")?.value}`
          }
        }
      }
    );

    // Verificar admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { data: perfil } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!perfil || perfil.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Obtener pago
    const { data: pago } = await supabase
      .from("pagos")
      .select("*")
      .eq("id", pago_id)
      .single();

    if (!pago) return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
    if (pago.estado !== "pendiente") {
      return NextResponse.json({ error: "El pago ya fue procesado" }, { status: 400 });
    }

    // Generar clave
    const clave = generarClave();

    // Crear licencia
    const { error: licError } = await supabase.from("licencias").insert({
      user_id: pago.user_id,
      plugin_id: pago.plugin_id,
      tipo_id: null, // luego puedes asignar tipo (perpetua, trial…)
      email_tekla: pago.email_tekla,
      codigo: clave,
      estado: "activa",
      max_activaciones: 3
    });

    if (licError) {
      return NextResponse.json({ error: licError.message }, { status: 500 });
    }

    // Marcar pago como aprobado
    await supabase
      .from("pagos")
      .update({ estado: "aprobado" })
      .eq("id", pago_id);

    // Enviar email al usuario
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "OMBIM <notificaciones@ombim.com>",
      to: pago.email_tekla,
      subject: "Tu licencia está lista",
      text: `
Tu licencia del plugin ya está activa.

Email de Tekla: ${pago.email_tekla}
Clave: ${clave}

Gracias por tu compra.
      `
    });

    return NextResponse.json({ ok: true, clave });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
