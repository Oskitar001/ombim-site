import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

export default async function DispositivosEmpresa({ cookies }) {
  const token = cookies.get("session")?.value;
  const decoded = jwt.decode(token);

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );

  const { data: dispositivos } = await supabase
    .from("dispositivos")
    .select("*, empleados(nombre)")
    .eq("empresa_id", decoded.empresa_id);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dispositivos</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Empleado</th>
            <th className="p-3">UUID</th>
            <th className="p-3">Estado</th>
          </tr>
        </thead>

        <tbody>
          {dispositivos.map((d) => (
            <tr key={d.id} className="border-t">
              <td className="p-3">{d.empleados?.nombre}</td>
              <td className="p-3">{d.uuid}</td>
              <td className="p-3">{d.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
