// app/api/admin/users/create/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { email, password, max_dispositivos, estado, fecha_expiracion, role } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // 1. Validar email duplicado
  const { data: existing } = await supabase
    .from("usuarios")
    .select("id")
    .eq("email", email)
    .limit(1);

  if (existing?.length > 0) {
    return NextResponse.json({ ok: false, error: "El email ya existe" });
  }

  // 2. Contraseña en texto plano (tu sistema actual)
  const password_hash = password;

  // 3. Insertar usuario
  const { error } = await supabase
    .from("usuarios")
    .insert({
      email,
      password_hash,
      max_dispositivos: max_dispositivos || 1,
      estado: estado || "activo",
      fecha_expiracion,
      role: role || "user"
    });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message });
  }

  return NextResponse.json({ ok: true });
}
