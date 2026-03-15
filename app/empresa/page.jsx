import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

export default async function EmpresaDashboard() {
  // Leer cookie
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return (
      <div className="p-10">
        <p>No hay sesión activa.</p>
        <a href="/empresa/login" className="text-blue-600 underline">
          Ir al login
        </a>
      </div>
    );
  }

  // Decodificar token
  const decoded = jwt.decode(token);

  // Conectar a Supabase
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );

  // Obtener datos de la empresa
  const { data: empresa } = await supabase
    .from("empresas")
    .select("*")
    .eq("id", decoded.empresa_id)
    .single();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">
        Bienvenido, {empresa?.nombre}
      </h1>

      <p className="text-gray-700 mb-6">
        Gestiona tus licencias, empleados y dispositivos desde aquí.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/empresa/licencias"
          className="p-6 bg-white shadow rounded hover:bg-gray-50"
        >
          <h2 className="text-xl font-bold">Licencias</h2>
          <p className="text-gray-600 mt-2">Ver tus licencias activas</p>
        </a>

        <a
          href="/empresa/empleados"
          className="p-6 bg-white shadow rounded hover:bg-gray-50"
        >
          <h2 className="text-xl font-bold">Empleados</h2>
          <p className="text-gray-600 mt-2">Gestiona tus empleados</p>
        </a>

        <a
          href="/empresa/dispositivos"
          className="p-6 bg-white shadow rounded hover:bg-gray-50"
        >
          <h2 className="text-xl font-bold">Dispositivos</h2>
          <p className="text-gray-600 mt-2">Controla los dispositivos</p>
        </a>

        <a
          href="/empresa/logs"
          className="p-6 bg-white shadow rounded hover:bg-gray-50"
        >
          <h2 className="text-xl font-bold">Logs</h2>
          <p className="text-gray-600 mt-2">Ver actividad reciente</p>
        </a>
      </div>

      <a
        href="/empresa/logout"
        className="text-red-600 underline block mt-8"
      >
        Cerrar sesión
      </a>
    </div>
  );
}
