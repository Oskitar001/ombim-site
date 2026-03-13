// app/api/cliente/info/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.cookies.get("client_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // 1. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Buscar usuario
    const { data: users } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", decoded.id)
      .limit(1);

    const user = users?.[0];
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // 3. Validar estado
    if (user.estado !== "activo") {
      return NextResponse.json({ error: "Usuario suspendido" }, { status: 403 });
    }

    // 4. Validar expiración
    const hoy = new Date();
    const exp = new Date(user.fecha_expiracion);
    const dias_restantes = Math.ceil((exp - hoy) / (1000 * 60 * 60 * 24));

    if (exp < hoy) {
      return NextResponse.json({
        error: "Licencia expirada",
        dias_restantes,
        fecha_expiracion: user.fecha_expiracion
      }, { status: 403 });
    }

    // 5. Obtener dispositivos
    const { data: dispositivos } = await supabase
      .from("dispositivos")
      .select("*")
      .eq("usuario_id", user.id);

    return NextResponse.json({
      ok: true,
      email: user.email,
      estado: user.estado,
      fecha_expiracion: user.fecha_expiracion,
      dias_restantes,
      max_dispositivos: user.max_dispositivos,
      dispositivos_usados: dispositivos.length,
      dispositivos
    });

  } catch (err) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}
