import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { email, password } = await req.json();

  // Buscar usuario
  const { data: users } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .limit(1);

  const user = users?.[0];

  if (!user) {
    return NextResponse.json({ ok: false });
  }

  // Verificar contraseña en texto plano
  const valid = password === user.password_hash;
  if (!valid) {
    return NextResponse.json({ ok: false });
  }

  // Crear token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const res = NextResponse.json({ ok: true });

  // Crear cookie segura
  res.cookies.set("client_token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  return res;
}
