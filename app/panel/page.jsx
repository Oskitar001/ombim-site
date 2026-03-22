import { supabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/login");
  }

  const user = data.user;

  // Comprobamos si es admin
  const isAdmin = user.email === process.env.ADMIN_EMAIL;

  return (
    <div className="pt-32 px-6 max-w-3xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Panel de usuario</h1>
        <p className="text-gray-600">Bienvenido, {user.email}</p>
      </div>

      {/* Tarjetas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Mis licencias */}
        <a
          href="/panel/mis-licencias"
          className="border rounded-lg p-6 hover:bg-gray-50 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Mis licencias</h2>
          <p className="text-gray-600 text-sm">
            Consulta y gestiona tus licencias activas.
          </p>
        </a>

        {/* Mis plugins */}
        <a
          href="/panel/mis-plugins"
          className="border rounded-lg p-6 hover:bg-gray-50 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Mis plugins</h2>
          <p className="text-gray-600 text-sm">
            Descarga y gestiona tus plugins adquiridos.
          </p>
        </a>

        {/* Mis descargas */}
        <a
          href="/panel/mis-descargas"
          className="border rounded-lg p-6 hover:bg-gray-50 transition"
        >
          <h2 className="text-xl font-semibold mb-2">Mis descargas</h2>
          <p className="text-gray-600 text-sm">
            Accede a tus descargas disponibles.
          </p>
        </a>
      </div>

      {/* Panel admin si es admin */}
      {isAdmin && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Panel de administración</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <a
              href="/panel/admin/dashboard"
              className="border rounded-lg p-6 hover:bg-gray-50 transition"
            >
              <h3 className="text-lg font-semibold mb-2">Dashboard</h3>
              <p className="text-gray-600 text-sm">
                Estadísticas y actividad general.
              </p>
            </a>

            <a
              href="/panel/admin/plugins"
              className="border rounded-lg p-6 hover:bg-gray-50 transition"
            >
              <h3 className="text-lg font-semibold mb-2">Plugins</h3>
              <p className="text-gray-600 text-sm">
                Gestiona los plugins del sistema.
              </p>
            </a>

            <a
              href="/panel/admin/pagos"
              className="border rounded-lg p-6 hover:bg-gray-50 transition"
            >
              <h3 className="text-lg font-semibold mb-2">Pagos</h3>
              <p className="text-gray-600 text-sm">
                Revisa y aprueba pagos.
              </p>
            </a>

            <a
              href="/panel/admin/licencias"
              className="border rounded-lg p-6 hover:bg-gray-50 transition"
            >
              <h3 className="text-lg font-semibold mb-2">Licencias</h3>
              <p className="text-gray-600 text-sm">
                Gestiona licencias de usuarios.
              </p>
            </a>

            <a
              href="/panel/admin/usuarios"
              className="border rounded-lg p-6 hover:bg-gray-50 transition"
            >
              <h3 className="text-lg font-semibold mb-2">Usuarios</h3>
              <p className="text-gray-600 text-sm">
                Lista y administración de usuarios.
              </p>
            </a>

            <a
              href="/panel/admin/logs"
              className="border rounded-lg p-6 hover:bg-gray-50 transition"
            >
              <h3 className="text-lg font-semibold mb-2">Logs</h3>
              <p className="text-gray-600 text-sm">
                Registro de acciones administrativas.
              </p>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
