import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.cookies.get("client_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: users } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", decoded.id)
      .limit(1);

    const user = users?.[0];
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" });

    const hoy = new Date();
    const dias = Math.ceil(
      (new Date(user.fecha_expiracion) - hoy) / (1000 * 60 * 60 * 24)
    );

    const { data: dispositivos } = await supabase
      .from("dispositivos")
      .select("*")
      .eq("usuario_id", user.id);

    return NextResponse.json({
      email: user.email,
      estado: user.estado,
      fecha_expiracion: user.fecha_expiracion,
      dias_restantes: dias,
      dispositivos,
    });

  } catch (err) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}
