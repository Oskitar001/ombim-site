import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

export default async function LogsEmpresa({ cookies }) {
  const token = cookies.get("session")?.value;
  const decoded = jwt.decode(token);

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );

  const { data: logs } = await supabase
    .from("logs")
    .select("*, empleados(nombre)")
    .eq("empresa_id", decoded.empresa_id)
    .order("id", { ascending: false });

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
          {logs.map((l) => (
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
