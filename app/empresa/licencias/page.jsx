import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

export default async function LicenciasEmpresa({ cookies }) {
  const token = cookies.get("session")?.value;
  const decoded = jwt.decode(token);

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );

  const { data: licencias } = await supabase
    .from("licencias")
    .select("*")
    .eq("empresa_id", decoded.empresa_id);

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
          {licencias.map((l) => (
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
