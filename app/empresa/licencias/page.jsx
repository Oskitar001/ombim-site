import { createClient } from "@supabase/supabase-js";

export default async function LicenciasEmpresa() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // Obtener empresa logueada (en tu caso, la primera)
  const { data: empresa } = await supabase
    .from("empresas")
    .select("id, nombre")
    .limit(1)
    .single();

  if (!empresa) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold">No se encontró la empresa</h1>
      </div>
    );
  }

  // Obtener licencias + plugin asociado
  const { data: licencias } = await supabase
    .from("licencias")
    .select("*, plugins(nombre, imagen_url)")
    .eq("empresa_id", empresa.id);

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Licencias de {empresa.nombre}
      </h1>

      {licencias?.length === 0 && (
        <p className="text-gray-600">No tienes licencias activas.</p>
      )}

      <div className="grid grid-cols-1 gap-6">
        {licencias?.map((lic) => (
          <div
            key={lic.id}
            className="bg-white shadow p-4 rounded flex items-center gap-4"
          >
            {lic.plugins?.imagen_url && (
              <img
                src={lic.plugins.imagen_url}
                className="w-24 h-24 object-cover rounded"
              />
            )}

            <div className="flex-1">
              <h2 className="text-xl font-bold">{lic.plugins?.nombre}</h2>

              <p className="text-gray-600">
                Inicio: {new Date(lic.fecha_inicio).toLocaleDateString()}
              </p>

              <p className="text-gray-600">
                Expira: {new Date(lic.fecha_expiracion).toLocaleDateString()}
              </p>

              <p
                className={`mt-2 font-semibold ${
                  lic.activa ? "text-green-600" : "text-red-600"
                }`}
              >
                {lic.activa ? "Activa" : "Inactiva"}
              </p>
            </div>

            {/* DESCARGA SEGURA */}
            <a
              href={`/api/plugins/download?plugin_id=${lic.plugin_id}&empresa_id=${empresa.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Descargar
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
