import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function POST(req) {
  try {
    const { clave, meses } = await req.json();

    if (!clave || !meses) {
      return NextResponse.json(
        { error: "Faltan datos: clave o meses" },
        { status: 400 }
      );
    }

    // Buscar licencia por clave
    const { data: licencia, error: licError } = await supabase
      .from("licencias")
      .select("*")
      .eq("clave", clave)
      .single();

    if (licError || !licencia) {
      return NextResponse.json(
        { error: "Licencia no encontrada" },
        { status: 404 }
      );
    }

    if (licencia.tipo !== "full") {
      return NextResponse.json(
        { error: "Solo las licencias de pago pueden renovarse" },
        { status: 403 }
      );
    }

    if (licencia.estado !== "activa") {
      return NextResponse.json(
        { error: "La licencia está revocada o inactiva" },
        { status: 403 }
      );
    }

    // Calcular nueva expiración
    const nuevaExpiracion = new Date(licencia.expiracion);
    nuevaExpiracion.setMonth(nuevaExpiracion.getMonth() + meses);

    // Actualizar en Supabase
    const { error: updateError } = await supabase
      .from("licencias")
      .update({ expiracion: nuevaExpiracion })
      .eq("id", licencia.id);

    if (updateError) {
      console.error("Error al renovar:", updateError);
      return NextResponse.json(
        { error: "No se pudo renovar la licencia" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      clave,
      nuevaExpiracion
    });

  } catch (error) {
    console.error("Error en renovar:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
