import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export default async function LicenciasPage() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );

  const { data: licencias } = await supabase
    .from("licencias")
    .select("*, empresas(nombre)")
    .order("id", { ascending: true });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Licencias</h1>
        <Link
          href="/admin/licencias/nueva"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Nueva licencia
        </Link>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">ID</th>
            <th className="p-3">Empresa</th>
            <th className="p-3">Plugin</th>
            <th className="p-3">Cantidad</th>
            <th className="p-3">Expira</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {licencias?.map((l) => (
            <tr key={l.id} className="border-t">
              <td className="p-3">{l.id}</td>
              <td className="p-3">{l.empresas?.nombre}</td>
              <td className="p-3">{l.plugin}</td>
              <td className="p-3">{l.cantidad}</td>
              <td className="p-3">
                {new Date(l.fecha_expiracion).toLocaleDateString()}
              </td>
              <td className="p-3">{l.estado}</td>
              <td className="p-3">
                <Link
                  href={`/admin/licencias/${l.id}`}
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
