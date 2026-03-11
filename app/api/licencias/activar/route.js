import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function POST(req) {
  try {
    const { clave, hardwareId } = await req.json();

    if (!clave || !hardwareId) {
      return NextResponse.json(
        { error: "Faltan datos: clave o hardwareId" },
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

    // Verificar estado
    if (licencia.estado !== "activa") {
      return NextResponse.json(
        { error: "La licencia está revocada o inactiva" },
        { status: 403 }
      );
    }

    // Verificar expiración
    const ahora = new Date();
    const exp = new Date(licencia.expiracion);

    if (ahora > exp) {
      return NextResponse.json(
        { error: "La licencia ha expirado" },
        { status: 403 }
      );
    }

    // Verificar activaciones existentes
    const { data: activaciones } = await supabase
      .from("activaciones")
      .select("*")
      .eq("licenciaId", licencia.id);

    const yaActivado = activaciones.find(a => a.hardwareId === hardwareId);

    if (!yaActivado) {
      // Si no está activado y ya alcanzó el límite
      if (activaciones.length >= licencia.maxActivaciones) {
        return NextResponse.json(
          { error: "Se alcanzó el límite de activaciones" },
          { status: 403 }
        );
      }

      // Registrar nueva activación
      await supabase.from("activaciones").insert({
        licenciaId: licencia.id,
        hardwareId
      });
    }

    return NextResponse.json({
      ok: true,
      tipo: licencia.tipo,
      expiracion: licencia.expiracion,
      activaciones: activaciones.length + (yaActivado ? 0 : 1)
    });

  } catch (error) {
    console.error("Error en activar:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
