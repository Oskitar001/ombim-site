import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

export default async function LicenciasEmpresa() {
  // Leer cookies desde el servidor
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Tus licencias</h1>
        <p>No hay sesión activa.</p>
      </div>
    );
  }

  const decoded = jwt.decode(token);

  if (!decoded?.empresa_id) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Tus licencias</h1>
        <p>Error: token inválido.</p>
      </div>
    );
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { data: licencias, error } = await supabase
    .from("licencias")
    .select("*")
    .eq("empresa_id", decoded.empresa_id);

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Tus licencias</h1>
        <p>Error al cargar licencias: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tus licencias</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Plugin</th>
            <th className="p-3">Cantidad</th>
            <th className="p-3">Expira</th>
            <th className="p-3">Estado</th>
          </tr>
        </thead>

        <tbody>
          {licencias?.map((l) => (
            <tr key={l.id} className="border-t">
              <td className="p-3">{l.plugin}</td>
              <td className="p-3">{l.cantidad}</td>
              <td className="p-3">
                {new Date(l.fecha_expiracion).toLocaleDateString()}
              </td>
              <td className="p-3">{l.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
