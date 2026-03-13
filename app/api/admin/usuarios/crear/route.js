import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";

export async function POST(req) {
  const { email, password, dias, maxDisp } = await req.json();

  // Guardar contraseña en texto plano
  const hash = password;

  const fecha = new Date();
  fecha.setDate(fecha.getDate() + Number(dias));

  const { error } = await supabase.from("usuarios").insert({
    email,
    password: hash,
    estado: "activo",
    fecha_expiracion: fecha.toISOString(),
    max_dispositivos: Number(maxDisp),
    dispositivos_usados: 0,
    fecha_creacion: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ msg: "Error al crear usuario" });
  }

  return NextResponse.json({ msg: "Usuario creado correctamente" });
}
