// app/api/admin/login/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  const { email, password } = await req.json();

  // 1. Buscar usuario
  const { data: user, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    return NextResponse.json({ success: false, message: "Usuario no encontrado" });
  }

  // 2. Validar contraseña en texto plano
  if (password !== user.password_hash) {
    return NextResponse.json({ success: false, message: "Contraseña incorrecta" });
  }

  // 3. Validar rol admin
  if (user.role !== "admin") {
    return NextResponse.json({ success: false, message: "No autorizado" });
  }

  // 4. Crear token simple
  const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");

  const res = NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });

  // 5. Guardar cookie
  res.cookies.set("admin_token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 4 // 4 horas
  });

  return res;
}
