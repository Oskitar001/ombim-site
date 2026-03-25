// app/api/admin/dashboard/route.js
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json(admin, { status: 403 });
  }

  // ==========================
  // CONSULTAS PRINCIPALES
  // ==========================
  const [
    totalLic,
    activas,
    bloqueadas,
    trials,
    pagos,
    pendientes,
    descargas,
    ingresosAprobados,
    descargasPorPlugin,
  ] = await Promise.all([
    supabaseAdmin.from("licencias").select("*", { count: "exact" }),

    supabaseAdmin
      .from("licencias")
      .select("*", { count: "exact" })
      .eq("estado", "activa"),

    supabaseAdmin
      .from("licencias")
      .select("*", { count: "exact" })
      .eq("estado", "bloqueada"),

    supabaseAdmin
      .from("licencias")
      .select("*", { count: "exact" })
      .eq("estado", "trial"),

    supabaseAdmin.from("pagos").select("*", { count: "exact" }),

    supabaseAdmin
      .from("pagos")
      .select("*", { count: "exact" })
      .eq("estado", "pendiente"),

    supabaseAdmin.from("descargas").select("*", { count: "exact" }),

    supabaseAdmin
      .from("pagos")
      .select("importe")
      .eq("estado", "aprobado"),

    supabaseAdmin
      .from("descargas")
      .select("plugin_id, count(*)", { group: "plugin_id" }),
  ]);

  // INGRESOS
  const ingresosTotales = (ingresosAprobados.data ?? []).reduce(
    (acc, p) => acc + (p.importe ?? 0),
    0
  );

  // DESCARGAS POR PLUGIN → diccionario
  const descPorPlugin = {};
  (descargasPorPlugin.data ?? []).forEach((d) => {
    descPorPlugin[d.plugin_id] = Number(d.count);
  });

  // ==========================
  // RESPUESTA FINAL
  // ==========================
  return NextResponse.json({
    totalLicencias: totalLic.count,
    licenciasActivas: activas.count,
    licenciasBloqueadas: bloqueadas.count,
    licenciasTrial: trials.count,
    totalPagos: pagos.count,
    pendientes: pendientes.count,
    descargasTotales: descargas.count,
    ingresosTotales,
    descargasPorPlugin: descPorPlugin,
  });
}