import { NextResponse } from "next/server";
import { requireAdmin } from "../_utils";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json(auth, { status: auth.status });

  const { supabase } = auth;

  const [licencias, activas, bloqueadas, activaciones, pagos, ingresos] =
    await Promise.all([
      supabase.from("licencias").select("*", { count: "exact" }),
      supabase.from("licencias").select("*", { count: "exact" }).eq("estado", "activa"),
      supabase.from("licencias").select("*", { count: "exact" }).eq("estado", "bloqueada"),
      supabase.from("activaciones").select("*", { count: "exact" }),
      supabase.from("pagos").select("*", { count: "exact" }),
      supabase.rpc("total_ingresos")
    ]);

  return NextResponse.json({
    totalLicencias: licencias.count,
    licenciasActivas: activas.count,
    licenciasBloqueadas: bloqueadas.count,
    activacionesTotales: activaciones.count,
    totalPagos: pagos.count,
    ingresosTotales: ingresos.data || 0
  });
}
