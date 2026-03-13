import { NextResponse } from "next/server";
import { supabase } from "../../../../../../lib/supabase";

export async function POST(req, { params }) {
  const { id } = params;
  const { email, password, estado, expira, maxDisp } = await req.json();

  let updateData = {
    email,
    estado,
    fecha_expiracion: new Date(expira).toISOString(),
    max_dispositivos: Number(maxDisp),
  };

  // Si el admin cambia la contraseña → guardar en texto plano
  if (password && password.trim() !== "") {
    updateData.password = password;
  }

  await supabase.from("usuarios").update(updateData).eq("id", id);

  return NextResponse.json({ msg: "Usuario actualizado correctamente" });
}
