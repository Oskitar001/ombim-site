import { NextResponse } from "next/server";
import { supabase } from "../../../../../../lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req, { params }) {
  const { id } = params;
  const { email, password, estado, expira, maxDisp } = await req.json();

  let updateData = {
    email,
    estado,
    fecha_expiracion: new Date(expira).toISOString(),
    max_dispositivos: Number(maxDisp),
  };

  if (password && password.trim() !== "") {
    const hash = await bcrypt.hash(password, 10);
    updateData.password = hash;
  }

  await supabase.from("usuarios").update(updateData).eq("id", id);

  return NextResponse.json({ msg: "Usuario actualizado correctamente" });
}
