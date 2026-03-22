export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const cookieStore = await cookies();

    // Obtener token del usuario
    const token =
      cookieStore.get("sb-access-token")?.value ||
      cookieStore.get("sb:token")?.value ||
      cookieStore.get("sb:access-token")?.value ||
      cookieStore.get("supabase-auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "NO_LOGIN" }, { status: 401 });
    }

    // Cliente Supabase con token del usuario
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SECRET_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // Obtener usuario autenticado
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      return NextResponse.json({ error: "NO_LOGIN" }, { status: 401 });
    }

    const user = userData.user;

    // Obtener licencias del usuario
    const { data, error } = await supabase
      .from("licencias")
      .select("*, plugins(nombre)")
      .eq("user_id", user.id)
      .order("fecha_creacion", { ascending: false });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "ERROR_DB" }, { status: 500 });
    }

    // Formatear respuesta
    const licencias = data.map((l) => ({
      id: l.id,
      email_tekla: l.email_tekla,
      plugin_nombre: l.plugins?.nombre || "—",
      estado: l.estado,
      activaciones_usadas: l.activaciones_usadas,
      max_activaciones: l.max_activaciones,
      fecha_creacion: l.fecha_creacion,
    }));

    return NextResponse.json(licencias);
  } catch (err) {
    console.error("Error en /api/licencias/mias:", err);
    return NextResponse.json({ error: "ERROR_INTERNO" }, { status: 500 });
  }
}
