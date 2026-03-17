"use client";
import { useEffect, useState } from "react";

export default function AdminLicencias() {
  const [licencias, setLicencias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [plugins, setPlugins] = useState([]);

  const cargarLicencias = async () => {
    const res = await fetch("/api/admin/licencias");
    const data = await res.json();
    setLicencias(data);
  };

  const cargarDatos = async () => {
    const res = await fetch("/api/admin/datos");
    const data = await res.json();
    setUsuarios(data.usuarios);
    setPlugins(data.plugins);
  };

  useEffect(() => {
    cargarLicencias();
    cargarDatos();
  }, []);

  const revocar = async clave => {
    await fetch("/api/licencia/revocar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clave })
    });
    cargarLicencias();
  };

  const desrevocar = async clave => {
    await fetch("/api/licencia/desrevocar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clave })
    });
    cargarLicencias();
  };

  const resetAbuso = async clave => {
    await fetch("/api/licencia/reset-abuso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clave })
    });
    cargarLicencias();
  };

  const generarClave = async e => {
    e.preventDefault();
    const user_id = e.target.user_id.value;
    const plugin_id = e.target.plugin_id.value;

    const res = await fetch("/api/licencia/generar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, plugin_id })
    });

    const data = await res.json();

    if (data.clave) {
      alert("Clave generada: " + data.clave);
      cargarLicencias();
    }
  };

  return (
    <div className="max-w-5xl mx-auto pt-32 px-6">
      <h1 className="text-3xl font-bold mb-6">Licencias entregadas</h1>

      {/* FORMULARIO PARA GENERAR CLAVE */}
      <div className="mb-6 p-4 border rounded bg-gray-50 dark:bg-gray-900">
        <h2 className="text-xl font-semibold mb-3">Generar nueva clave</h2>

        <form onSubmit={generarClave} className="flex gap-4">

          {/* SELECT USUARIO */}
          <select
            name="user_id"
            className="border p-2 rounded w-1/3"
            required
          >
            <option value="">Selecciona usuario</option>
            {usuarios.map(u => (
              <option key={u.id} value={u.id}>
                {u.email}
              </option>
            ))}
          </select>

          {/* SELECT PLUGIN */}
          <select
            name="plugin_id"
            className="border p-2 rounded w-1/3"
            required
          >
            <option value="">Selecciona plugin</option>
            {plugins.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Generar
          </button>
        </form>
      </div>

      {/* TABLA DE LICENCIAS */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800">
            <th className="p-2 text-left">Plugin</th>
            <th className="p-2 text-left">Usuario</th>
            <th className="p-2 text-left">Clave</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-left">IPs únicas</th>
            <th className="p-2 text-left">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {licencias.map(l => (
            <tr key={l.id} className="border-b dark:border-gray-700">
              <td className="p-2">{l.plugins?.nombre}</td>
              <td className="p-2">{l.users?.email}</td>
              <td className="p-2 font-mono">{l.clave}</td>

              <td className="p-2">
                {l.revocada ? (
                  <span className="text-red-600 font-semibold">
                    Revocada {l.revocada_por_abuso && "(abuso)"}
                  </span>
                ) : (
                  <span className="text-green-600 font-semibold">Activa</span>
                )}
              </td>

              <td className="p-2">
                <a
                  href={`/admin/licencias/${l.clave}`}
                  className="text-blue-600 underline"
                >
                  {l.ips_unicas}
                </a>
              </td>

              <td className="p-2 flex gap-2">
                {l.revocada ? (
                  <>
                    <button
                      onClick={() => desrevocar(l.clave)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Reactivar
                    </button>

                    {l.revocada_por_abuso && (
                      <button
                        onClick={() => resetAbuso(l.clave)}
                        className="bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Resetear abuso
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => revocar(l.clave)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Revocar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
