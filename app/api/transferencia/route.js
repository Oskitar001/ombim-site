import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { plugin_id } = body;

    // Obtener cookies (Next 16 → PROMESA)
    const cookieStore = await cookies();

    // Conectar a Supabase con sesión del usuario
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

    // Obtener usuario autenticado
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // Obtener datos del plugin
    const { data: plugin, error: pluginError } = await supabase
      .from("plugins")
      .select("*")
      .eq("id", plugin_id)
      .single();

    if (pluginError || !plugin) {
      return NextResponse.json({ error: "Plugin no encontrado" }, { status: 404 });
    }

    // Registrar pago pendiente
    const { error: pagoError } = await supabase
      .from("pagos")
      .insert({
        user_id: user.id,
        plugin_id,
        estado: "pendiente",
        clave: null
      });

    if (pagoError) {
      return NextResponse.json({ error: pagoError.message }, { status: 500 });
    }

    // Enviar email a Óscar
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "o.martinez@ombim.com",
      subject: `Nuevo aviso de transferencia — ${plugin.nombre}`,
      text: `
El usuario ${user.email} ha indicado que ha realizado la transferencia.

Plugin: ${plugin.nombre}
Precio: ${plugin.precio} €
Plugin ID: ${plugin_id}

Revisa tu banco y confirma el pago en el panel de administración.
      `
    });

    return NextResponse.json({ ok: true });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
