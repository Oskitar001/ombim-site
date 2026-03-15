export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export async function POST(req) {
  try {
    const { token, accion, detalle } = await req.json();

    if (!token || !accion) {
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

    // 2. Registrar log
    await supabase.from("logs").insert({
      empleado_id,
      accion,
      detalle: detalle || "",
      fecha: new Date()
    });

    return NextResponse.json({
      ok: true,
      error: "",
      mensaje: "Log registrado correctamente"
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
