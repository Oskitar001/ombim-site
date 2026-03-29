// /app/api/user/perfil/route.js
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await supabaseServer();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "no_autenticado" }, { status: 401 });
  }

  // Leer facturación
  const { data: fact } = await supabase
    .from("facturacion")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const f = fact ?? {};

  // Metadata del usuario
  const nombreUsuario = user.user_metadata?.nombre ?? "";
  const empresaUsuario = user.user_metadata?.empresa ?? "";
  const telefonoUsuario = user.user_metadata?.telefono ?? "";
  const paisUsuario = user.user_metadata?.pais ?? "";

  // Fallback para facturación.nombre
  const nombreFacturacion =
    f.nombre?.trim()
      ? f.nombre
      : empresaUsuario?.trim()
      ? empresaUsuario
      : nombreUsuario;

  return NextResponse.json({
    email: user.email,

    // Datos usuario
    nombre_usuario: nombreUsuario,
    empresa_usuario: empresaUsuario,
    telefono_usuario: telefonoUsuario,
    pais_usuario: paisUsuario,

    // Facturación PREMIUM (plana)
    nombre: nombreFacturacion,
    nif: f.nif ?? "",
    direccion: f.direccion ?? "",
    ciudad: f.ciudad ?? "",
    cp: f.cp ?? "",
    pais: f.pais ?? paisUsuario,
    telefono: f.telefono ?? telefonoUsuario,
  });
}