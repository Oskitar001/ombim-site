import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { enviarEmail } from "@/lib/email";

export async function POST(req) {
  try {
    const { id, email, estado, expiracion, password } = await req.json();

    if (!id) {
      return NextResponse.json({ ok: false, error: "ID requerido" });
    }

    // Obtener usuario actual
    const { data: users } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", id)
      .limit(1);

    const user = users?.[0];

    const updateData = {
      email,
      estado,
      fecha_expiracion: expiracion,
    };

    // Si el admin cambia la contraseña → guardar en texto plano
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

    // Detectar renovación
    if (expiracion && expiracion !== user.fecha_expiracion) {
      const html = `
        <h2>Tu licencia ha sido renovada</h2>
        <p><strong>Nueva fecha de expiración:</strong> ${expiracion}</p>
        <p>Gracias por seguir usando OMBIM.</p>
      `;

      await enviarEmail(email, "Tu licencia ha sido renovada", html);
    }

    // Detectar suspensión
    if (estado === "suspendido" && user.estado !== "suspendido") {
      const html = `
        <h2>Tu licencia ha sido suspendida</h2>
        <p>Contacta con soporte si crees que es un error.</p>
      `;

      await enviarEmail(email, "Tu licencia ha sido suspendida", html);
    }

    // Detectar reactivación
    if (estado === "activo" && user.estado === "suspendido") {
      const html = `
        <h2>Tu licencia ha sido reactivada</h2>
        <p>Ya puedes volver a usar el plugin.</p>
      `;

      await enviarEmail(email, "Tu licencia ha sido reactivada", html);
    }

    return NextResponse.json({ ok: true });

  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error interno" });
  }
}
