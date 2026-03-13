// app/api/cliente/logout-all/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const token = req.cookies.get("client_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // 1. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Buscar usuario
    const { data: user } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", decoded.id)
      .single();

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

    if (exp < hoy) {
      return NextResponse.json({ error: "Licencia expirada" }, { status: 403 });
    }

    // 5. Obtener dispositivos antes de borrar
    const { data: dispositivos } = await supabase
      .from("dispositivos")
      .select("*")
      .eq("usuario_id", user.id);

    const total = dispositivos.length;

    // 6. Borrar todos los dispositivos
    await supabase
      .from("dispositivos")
      .delete()
      .eq("usuario_id", user.id);

    // 7. Registrar log
    await supabase.from("logs").insert({
      usuario_id: user.id,
      accion: "logout-all",
      fecha: new Date().toISOString()
    });

    return NextResponse.json({
      ok: true,
      dispositivos_eliminados: total
    });

  } catch (err) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}
