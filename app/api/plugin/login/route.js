import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export async function POST(req) {
  try {
    const { email, password, plugin } = await req.json();

    if (!email || !password || !plugin) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // 1. Buscar empresa por email
    const { data: empresa } = await supabase
      .from("empresas")
      .select("*")
      .eq("email", email)
      .single();

    if (!empresa) {
      return NextResponse.json(
        { error: "Empresa no encontrada" },
        { status: 404 }
      );
    }

    // 2. Validar contraseña
    const bcrypt = require("bcryptjs");
    const passwordOK = await bcrypt.compare(password, empresa.password_hash);

    if (!passwordOK) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // 3. Empresa suspendida
    if (empresa.estado !== "activa") {
      return NextResponse.json(
        { error: "Empresa suspendida" },
        { status: 403 }
      );
    }

    // 4. Buscar licencia del plugin
    const { data: licencia } = await supabase
      .from("licencias")
      .select("*")
      .eq("empresa_id", empresa.id)
      .eq("plugin", plugin)
      .single();

    if (!licencia) {
      return NextResponse.json(
        { error: "La empresa no tiene licencia para este plugin" },
        { status: 403 }
      );
    }

    // 5. Licencia caducada
    const hoy = new Date();
    const exp = new Date(licencia.fecha_expiracion);

    if (exp < hoy) {
      return NextResponse.json(
        { error: "Licencia expirada" },
        { status: 403 }
      );
    }

    // 6. Buscar empleado
    const { data: empleado } = await supabase
      .from("empleados")
      .select("*")
      .eq("empresa_id", empresa.id)
      .eq("email", email)
      .single();

    if (!empleado) {
      return NextResponse.json(
        { error: "Empleado no registrado en la empresa" },
        { status: 404 }
      );
    }

    if (empleado.estado !== "activo") {
      return NextResponse.json(
        { error: "Empleado inactivo" },
        { status: 403 }
      );
    }

    // 7. Generar token
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      {
        empleado_id: empleado.id,
        empresa_id: empresa.id,
        plugin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // 8. Calcular días restantes
    const diffTime = Math.abs(exp - hoy);
    const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 9. Respuesta EXACTA como TokenInfo.cs
    return NextResponse.json({
      token: token,
      usuarioId: empleado.id,
      timestamp: Math.floor(Date.now() / 1000),
      diasRestantes: diasRestantes,
      estado: "activa",
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
