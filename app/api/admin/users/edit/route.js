// app/api/admin/users/edit/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const { id, email, estado, max_dispositivos, nueva_password } =
    await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  let updateData = {
    email,
    estado,
    max_dispositivos
  };

  // Si hay nueva contraseña, la guardamos tal cual (sin hash)
  if (nueva_password && nueva_password.trim() !== "") {
    updateData.password = nueva_password;
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
