// app/api/cliente/login/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { email, password, hwid } = await req.json();

  // Si no viene HWID desde navegador, asignamos uno fijo
  const finalHWID = hwid || "web-browser";

  // 1. Buscar usuario
  const { data: users } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .limit(1);

  const user = users?.[0];

  if (!user) {
    return NextResponse.json({ ok: false, error: "Usuario no encontrado" });
  }

  // 2. Validar contraseña en texto plano
  if (password !== user.password_hash) {
    return NextResponse.json({ ok: false, error: "Contraseña incorrecta" });
  }

  // 3. Validar estado
  if (user.estado !== "activo") {
    return NextResponse.json({ ok: false, error: "Cuenta suspendida" });
  }

  // 4. Validar expiración
  const hoy = new Date();
  const exp = new Date(user.fecha_expiracion);

  if (exp < hoy) {
    return NextResponse.json({ ok: false, error: "Licencia expirada" });
  }

  // 5. Validar HWID y límite de dispositivos
  const { data: dispositivos } = await supabase
    .from("dispositivos")
    .select("*")
    .eq("usuario_id", user.id);

  const existeHWID = dispositivos?.find(d => d.hwid === finalHWID);

  if (!existeHWID) {
    if (dispositivos.length >= user.max_dispositivos) {
      return NextResponse.json({ ok: false, error: "Límite de dispositivos alcanzado" });
    }

    await supabase.from("dispositivos").insert({
      usuario_id: user.id,
      hwid: finalHWID,
      fecha_registro: new Date().toISOString(),
      ultima_conexion: new Date().toISOString()
    });
  } else {
    await supabase
      .from("dispositivos")
      .update({ ultima_conexion: new Date().toISOString() })
      .eq("id", existeHWID.id);
  }

  // 6. Registrar log
  await supabase.from("logs").insert({
    usuario_id: user.id,
    email: user.email,
    accion: "login",
    hardwareId: finalHWID,
    fecha: new Date().toISOString()
  });

  // 7. Crear token JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const res = NextResponse.json({
    ok: true,
    id: user.id,
    email: user.email,
    expiracion: user.fecha_expiracion
  });

  // 8. Cookie segura SOLO en producción
  res.cookies.set("client_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return res;
}
