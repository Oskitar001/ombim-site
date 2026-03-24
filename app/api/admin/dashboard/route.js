import { NextResponse } from "next/server";
import { requireAdmin } from "../_utils.js";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json(auth, { status: auth.status });

  const { supabase } = auth;

  const [licencias, activas, bloqueadas, pagos, activaciones, aprobados] =
    await Promise.all([
      supabase.from("licencias").select("*", { count: "exact" }),
      supabase.from("licencias").select("*", { count: "exact" }).eq("estado", "activa"),
      supabase.from("licencias").select("*", { count: "exact" }).eq("estado", "bloqueada"),
      supabase.from("pagos").select("*", { count: "exact" }),
      supabase.from("licencias").select("activaciones_usadas"),
      supabase.from("pagos").select("importe").eq("estado", "aprobado"),
    ]);

  const activacionesTotales = (activaciones.data || []).reduce(
    (sum, l) => sum + (l.activaciones_usadas || 0),
    0
  );
  const ingresosTotales = (aprobados.data || []).reduce(
    (sum, p) => sum + (p.importe || 0),
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
