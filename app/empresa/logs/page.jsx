import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

export default async function LogsEmpresa() {
  // Leer cookies desde el servidor
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Logs</h1>
        <p>No hay sesión activa.</p>
      </div>
    );
  }

  const decoded = jwt.decode(token);

  if (!decoded?.empresa_id) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Logs</h1>
        <p>Error: token inválido.</p>
      </div>
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { data: logs, error } = await supabase
    .from("logs")
    .select("*, empleados(nombre)")
    .eq("empresa_id", decoded.empresa_id)
    .order("id", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Logs</h1>
        <p>Error al cargar logs: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Logs</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Empleado</th>
            <th className="p-3">Acción</th>
            <th className="p-3">Fecha</th>
          </tr>
        </thead>

        <tbody>
          {logs?.map((l) => (
            <tr key={l.id} className="border-t">
              <td className="p-3">{l.empleados?.nombre || "-"}</td>
              <td className="p-3">{l.accion}</td>
              <td className="p-3">
                {new Date(l.fecha).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
