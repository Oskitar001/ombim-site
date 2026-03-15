import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

export default async function EmpleadosEmpresa({ cookies }) {
  const token = cookies.get("session")?.value;
  const decoded = jwt.decode(token);

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );

  const { data: empleados } = await supabase
    .from("empleados")
    .select("*")
    .eq("empresa_id", decoded.empresa_id);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Empleados</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Nombre</th>
            <th className="p-3">Email</th>
            <th className="p-3">Estado</th>
          </tr>
        </thead>

        <tbody>
          {empleados.map((e) => (
            <tr key={e.id} className="border-t">
              <td className="p-3">{e.nombre}</td>
              <td className="p-3">{e.email}</td>
              <td className="p-3">{e.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
