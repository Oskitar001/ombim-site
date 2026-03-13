// app/api/admin/user/update/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { id, email, estado, fecha_expiracion, role, max_dispositivos, password } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const updateData = {
    email,
    estado,
    fecha_expiracion,
    role,
    max_dispositivos
  };

  // Si se envía una nueva contraseña → se guarda en texto plano
  if (password && password.trim() !== "") {
    updateData.password_hash = password;
  }

  const { error } = await supabase
    .from("usuarios")
    .update(updateData)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message });
  }

  return NextResponse.json({ ok: true });
}
