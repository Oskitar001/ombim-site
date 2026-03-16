import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

export default async function DashboardEmpresa() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { data: empresa } = await supabase
    .from("empresas")
    .select("id, nombre")
    .limit(1)
    .single();

  const { data: licencias } = await supabase
    .from("licencias")
    .select("id")
    .eq("empresa_id", empresa.id);

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        Bienvenido, {empresa.nombre}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Link
          href="/empresa/plugins"
          className="bg-white shadow p-6 rounded hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold">Plugins</h2>
          <p className="text-gray-600 mt-2">Explora el marketplace</p>
        </Link>

        <Link
          href="/empresa/licencias"
          className="bg-white shadow p-6 rounded hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold">Licencias</h2>
          <p className="text-gray-600 mt-2">
            Tienes {licencias?.length || 0} licencias
          </p>
        </Link>

        <Link
          href="/empresa/logs"
          className="bg-white shadow p-6 rounded hover:shadow-lg transition"
        >
          <h2 className="text-xl font-bold">Actividad</h2>
          <p className="text-gray-600 mt-2">Ver registros</p>
        </Link>
      </div>
    </div>
  );
}
