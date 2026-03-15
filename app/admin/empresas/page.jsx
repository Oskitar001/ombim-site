import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export default async function EmpresasPage() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { data: empresas } = await supabase
    .from("empresas")
    .select("*")
    .order("id", { ascending: true });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Empresas</h1>
        <Link
          href="/admin/empresas/nueva"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Nueva empresa
        </Link>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">ID</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Email</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresas?.map((e) => (
            <tr key={e.id} className="border-t">
              <td className="p-3">{e.id}</td>
              <td className="p-3">{e.nombre}</td>
              <td className="p-3">{e.email}</td>
              <td className="p-3">{e.estado}</td>
              <td className="p-3">
                <Link
                  href={`/admin/empresas/${e.id}`}
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
