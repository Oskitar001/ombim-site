import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  try {
    const {
      nombre,
      email,
      password,
      empresa,
      telefono,
      pais,
      idioma
    } = await req.json();

    if (!nombre || !email || !password) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // Crear usuario con metadata completa
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: {
        nombre,
        empresa,
        telefono,
        pais,
        idioma,
        role: "user"
      }
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Enviar email de verificación
    await supabaseAdmin.auth.admin.generateLink({
      type: "signup",
      email
    });

    return NextResponse.json({
      ok: true,
      message: "Registro completado. Revisa tu email para confirmar tu cuenta."
    });

  } catch (err) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}