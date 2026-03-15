import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 1. Buscar usuario en la tabla correcta
    const { data: user, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json({
        success: false,
        message: "Credenciales incorrectas"
      });
    }

    // 2. Validar contraseña (texto plano)
    if (password !== user.password_hash) {
      return NextResponse.json({
        success: false,
        message: "Credenciales incorrectas"
      });
    }

    // 3. Validar rol
    if (user.role !== "admin") {
      return NextResponse.json({
        success: false,
        message: "No autorizado"
      });
    }

    // 4. Crear cookie
    const response = NextResponse.json({
      success: true,
      message: "Login correcto"
    });

    response.cookies.set("admin_token", "admin_session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    return response;

  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Error interno"
    });
  }
}
