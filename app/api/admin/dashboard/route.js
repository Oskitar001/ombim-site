// app/api/admin/dashboard/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json(admin, { status: 403 });
  }

  const [
    licencias,
    activas,
    bloqueadas,
    pagos,
    activaciones,
    aprobados
  ] = await Promise.all([
    supabaseAdmin.from("licencias").select("*", { count: "exact" }),
    supabaseAdmin.from("licencias").select("*", { count: "exact" }).eq("estado", "activa"),
    supabaseAdmin.from("licencias").select("*", { count: "exact" }).eq("estado", "bloqueada"),
    supabaseAdmin.from("pagos").select("*", { count: "exact" }),
    supabaseAdmin.from("licencias").select("activaciones_usadas"),
    supabaseAdmin.from("pagos").select("importe").eq("estado", "aprobado")
  ]);

  const activacionesTotales = (activaciones.data ?? []).reduce(
    (sum, l) => sum + (l.activaciones_usadas ?? 0),
    0
  );

  const ingresosTotales = (aprobados.data ?? []).reduce(
    (sum, p) => sum + (p.importe ?? 0),
    0
  );

  return NextResponse.json({
    totalLicencias: licencias.count,
    licenciasActivas: activas.count,
    licenciasBloqueadas: bloqueadas.count,
    totalPagos: pagos.count,
    activacionesTotales,
    ingresosTotales,
  });
}