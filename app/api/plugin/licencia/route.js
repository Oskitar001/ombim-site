export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Token no proporcionado" },
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
    const empresa_id = decoded.empresa_id;
    const plugin = decoded.plugin;

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

    if (empleado.estado !== "activo") {
      return NextResponse.json(
        { ok: false, error: "Empleado inactivo" },
        { status: 403 }
      );
    }

    // 3. Buscar licencia
    const { data: licencia } = await supabase
      .from("licencias")
      .select("*")
      .eq("empresa_id", empresa_id)
      .eq("plugin", plugin)
      .single();

    if (!licencia) {
      return NextResponse.json(
        { ok: false, error: "Licencia no encontrada" },
        { status: 404 }
      );
    }

    // 4. Comprobar expiración
    const hoy = new Date();
    const exp = new Date(licencia.fecha_expiracion);

    if (exp < hoy) {
      return NextResponse.json({
        ok: false,
        error: "Licencia expirada",
        token,
        usuario_id: empleado_id,
        dias_restantes: 0,
        estado: "expirada"
      });
    }

    // 5. Calcular días restantes
    const diffTime = Math.abs(exp - hoy);
    const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 6. Respuesta EXACTA como LicenciaResponse.cs
    return NextResponse.json({
      ok: true,
      error: "",
      token,
      usuario_id: empleado_id,
      dias_restantes: diasRestantes,
      estado: "activa"
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
