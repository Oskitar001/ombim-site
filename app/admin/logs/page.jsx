import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export default async function LogsPage() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );

  const { data: logs } = await supabase
    .from("logs")
    .select("*, empresas(nombre), empleados(nombre)")
    .order("id", { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Logs del sistema</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">ID</th>
            <th className="p-3">Empresa</th>
            <th className="p-3">Empleado</th>
            <th className="p-3">Acción</th>
            <th className="p-3">Fecha</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {logs?.map((l) => (
            <tr key={l.id} className="border-t">
              <td className="p-3">{l.id}</td>
              <td className="p-3">{l.empresas?.nombre || "-"}</td>
              <td className="p-3">{l.empleados?.nombre || "-"}</td>
              <td className="p-3">{l.accion}</td>
              <td className="p-3">
                {new Date(l.fecha).toLocaleString()}
              </td>
              <td className="p-3">
                <Link
                  href={`/admin/logs/${l.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Ver
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
