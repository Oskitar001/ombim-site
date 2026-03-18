export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { checkAdmin } from "@/lib/checkAdmin";

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  // Total licencias
  const { count: totalLicencias } = await supabaseAdmin
    .from("licencias")
    .select("*", { count: "exact", head: true });

  // Licencias activas
  const { count: licenciasActivas } = await supabaseAdmin
    .from("licencias")
    .select("*", { count: "exact", head: true })
    .eq("estado", "activa");

  // Licencias bloqueadas
  const { count: licenciasBloqueadas } = await supabaseAdmin
    .from("licencias")
    .select("*", { count: "exact", head: true })
    .eq("estado", "bloqueada");

  // Activaciones totales
  const { count: activacionesTotales } = await supabaseAdmin
    .from("licencia_activaciones")
    .select("*", { count: "exact", head: true });

  // Pagos totales
  const { count: totalPagos } = await supabaseAdmin
    .from("pagos")
    .select("*", { count: "exact", head: true });

  // Ingresos totales
  const { data: pagos } = await supabaseAdmin
    .from("pagos")
    .select("cantidad");

  const ingresosTotales = pagos?.reduce((acc, p) => acc + (p.cantidad || 0), 0) || 0;

  // Últimos pagos
  const { data: ultimosPagos } = await supabaseAdmin
    .from("pagos")
    .select("*")
    .order("fecha", { ascending: false })
    .limit(5);

  // Últimas licencias
  const { data: ultimasLicencias } = await supabaseAdmin
    .from("licencias")
    .select("*")
    .order("fecha_creacion", { ascending: false })
    .limit(5);

  return NextResponse.json({
    totalLicencias,
    licenciasActivas,
    licenciasBloqueadas,
    activacionesTotales,
    totalPagos,
    ingresosTotales,
    ultimosPagos,
    ultimasLicencias,
  });
}
