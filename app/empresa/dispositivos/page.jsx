import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

export default async function DispositivosEmpresa() {
  // Leer cookies desde el servidor (forma correcta en Next.js 16)
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  // Si no hay token, evitar errores
  if (!token) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Dispositivos</h1>
        <p>No hay sesión activa.</p>
      </div>
    );
  }

  // Decodificar JWT
  const decoded = jwt.decode(token);

  // Si el token no es válido
  if (!decoded?.empresa_id) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Dispositivos</h1>
        <p>Error: token inválido.</p>
      </div>
    );
  }

  // Crear cliente Supabase (server-side)
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // Consultar dispositivos
  const { data: dispositivos, error } = await supabase
    .from("dispositivos")
    .select("*, empleados(nombre)")
    .eq("empresa_id", decoded.empresa_id);

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Dispositivos</h1>
        <p>Error al cargar dispositivos: {error.message}</p>
      </div>
    );
  }

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
          {dispositivos?.map((d) => (
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
