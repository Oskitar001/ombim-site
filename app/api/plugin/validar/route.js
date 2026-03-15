import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

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

    // 6. Validar dispositivos
    const { data: dispositivos } = await supabase
      .from("dispositivos")
      .select("*")
      .eq("empleado_id", empleado_id);

    const dispositivosUsados = dispositivos?.length || 0;

    if (
      dispositivosUsados >= licencia.max_dispositivos &&
      !dispositivos.some((d) => d.hardware_id === hardware_id)
    ) {
      return NextResponse.json({
        ok: false,
        error: "Límite de dispositivos alcanzado",
        token,
        usuario_id: empleado_id,
        dias_restantes: diasRestantes,
        estado: "bloqueada"
      });
    }

    // 7. Registrar dispositivo si es nuevo
    if (!dispositivos.some((d) => d.hardware_id === hardware_id)) {
      await supabase.from("dispositivos").insert({
        empleado_id,
        hardware_id,
        ultima_conexion: new Date()
      });
    } else {
      // actualizar última conexión
      await supabase
        .from("dispositivos")
        .update({ ultima_conexion: new Date() })
        .eq("empleado_id", empleado_id)
        .eq("hardware_id", hardware_id);
    }

    // 8. Registrar log
    await supabase.from("logs").insert({
      empleado_id,
      accion: "validacion",
      detalle: `Validación correcta desde hardware ${hardware_id}`
    });

    // 9. Respuesta EXACTA como LicenciaResponse.cs
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
