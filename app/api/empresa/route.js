export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Faltan datos" },
        { status: 400 }
      );
    }

    // Buscar empresa por email
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

    // Comparación SIN HASH
    if (empresa.password_hash !== password) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    // Crear token
    const token = jwt.sign(
      {
        empresa_id: empresa.id,
        email: empresa.email,
        rol: "empresa",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Guardar cookie
    const response = NextResponse.json({ ok: true });

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
