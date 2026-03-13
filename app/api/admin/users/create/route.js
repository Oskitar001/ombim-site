// app/api/admin/users/create/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { email, password, max_dispositivos } = await req.json();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const passwordHash = bcrypt.hashSync(password, 10);

  const { error } = await supabase.from("usuarios").insert({
    email,
    password: passwordHash,
    estado: "activo",
    max_dispositivos
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message });
  }

  return NextResponse.json({ ok: true });
}
