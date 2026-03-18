export default function LicenciasTable({ licencias }) {
  return (
    <table className="w-full bg-white shadow rounded">
      <thead>
        <tr className="bg-gray-200 text-left">
          <th className="p-2">Email Tekla</th>
          <th className="p-2">Plugin</th>
          <th className="p-2">Estado</th>
          <th className="p-2">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {licencias.map((l) => (
          <tr key={l.id} className="border-t">
            <td className="p-2">{l.email_tekla}</td>
            <td className="p-2">{l.plugin_id}</td>
            <td className="p-2">{l.estado}</td>
            <td className="p-2">
              <a
                href={`/admin/licencias/${l.id}`}
                className="text-blue-600 underline"
              >
                Ver
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
