import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

export default async function EmpleadosEmpresa() {
  // Leer cookies desde el servidor
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Empleados</h1>
        <p>No hay sesión activa.</p>
      </div>
    );
  }

  const decoded = jwt.decode(token);

  if (!decoded?.empresa_id) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Empleados</h1>
        <p>Error: token inválido.</p>
      </div>
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { data: empleados, error } = await supabase
    .from("empleados")
    .select("*")
    .eq("empresa_id", decoded.empresa_id);

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Empleados</h1>
        <p>Error al cargar empleados: {error.message}</p>
      </div>
    );
  }

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
          {empleados?.map((e) => (
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
