export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export async function POST(req) {
  try {
    const { token, hardware_id } = await req.json();

    if (!token || !hardware_id) {
      return NextResponse.json(
        { ok: false, error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // 1. Verificar token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: "Token inválido o expirado" },
        { status: 401 }
      );
    }

    const empleado_id = decoded.empleado_id;

    // 2. Buscar empleado
    const { data: empleado } = await supabase
      .from("empleados")
      .select("*")
      .eq("id", empleado_id)
      .single();

    if (!empleado) {
      return NextResponse.json(
        { ok: false, error: "Empleado no encontrado" },
        { status: 404 }
      );
    }

    // 3. Buscar si el dispositivo ya existe
    const { data: dispositivo } = await supabase
      .from("dispositivos")
      .select("*")
      .eq("empleado_id", empleado_id)
      .eq("hardware_id", hardware_id)
      .single();

    if (!dispositivo) {
      // Registrar nuevo dispositivo
      await supabase.from("dispositivos").insert({
        empleado_id,
        hardware_id,
        ultima_conexion: new Date()
      });
    } else {
      // Actualizar última conexión
      await supabase
        .from("dispositivos")
        .update({ ultima_conexion: new Date() })
        .eq("id", dispositivo.id);
    }

    return NextResponse.json({
      ok: true,
      error: "",
      mensaje: "Dispositivo registrado correctamente"
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
