import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export default async function DispositivosPage() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { data: dispositivos } = await supabase
    .from("dispositivos")
    .select("*, empleados(nombre), empresas(nombre)")
    .order("id", { ascending: true });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dispositivos</h1>
        <Link
          href="/admin/dispositivos/nueva"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Nuevo dispositivo
        </Link>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">ID</th>
            <th className="p-3">Empresa</th>
            <th className="p-3">Empleado</th>
            <th className="p-3">UUID</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {dispositivos?.map((d) => (
            <tr key={d.id} className="border-t">
              <td className="p-3">{d.id}</td>
              <td className="p-3">{d.empresas?.nombre}</td>
              <td className="p-3">{d.empleados?.nombre}</td>
              <td className="p-3">{d.uuid}</td>
              <td className="p-3">{d.estado}</td>
              <td className="p-3">
                <Link
                  href={`/admin/dispositivos/${d.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
