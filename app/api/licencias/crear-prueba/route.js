import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function POST(req) {
  try {
    const { email, hardwareId } = await req.json();

    if (!email || !hardwareId) {
      return NextResponse.json(
        { error: "Faltan datos: email o hardwareId" },
        { status: 400 }
      );
    }

    // Comprobar si ya existe una prueba para este email
    const { data: existente } = await supabase
      .from("licencias")
      .select("*")
      .eq("email", email)
      .eq("tipo", "trial")
      .single();

    if (existente) {
      return NextResponse.json(
        { error: "Ya existe una prueba para este email" },
        { status: 409 }
      );
    }

    // Crear fecha de expiración (7 días)
    const expiracion = new Date();
    expiracion.setDate(expiracion.getDate() + 7);

    // Crear licencia trial
    const { data: licencia, error } = await supabase
      .from("licencias")
      .insert({
        email,
        tipo: "trial",
        estado: "activa",
        expiracion,
        maxActivaciones: 1
      })
      .select()
      .single();

    if (error) {
      console.error("Error insertando licencia:", error);
      return NextResponse.json(
        { error: "No se pudo crear la licencia" },
        { status: 500 }
      );
    }

    // Registrar activación inicial
    await supabase.from("activaciones").insert({
      licenciaId: licencia.id,
      hardwareId
    });

    return NextResponse.json({
      ok: true,
      licenciaId: licencia.id,
      expiracion
    });

  } catch (error) {
    console.error("Error en crear-prueba:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
