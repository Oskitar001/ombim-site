export default async function VersionsListPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/plugin/get`, {
    cache: "no-store"
  });

  const versions = await res.json();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Versiones del plugin</h1>

      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Versión</th>
            <th>Fecha</th>
            <th>Notas</th>
            <th>Descargas</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {versions.map((v) => (
            <tr key={v.id}>
              <td>{v.version}</td>
              <td>{v.fecha}</td>
              <td>{v.notas}</td>
              <td>{v.descargas}</td>
              <td>
                <a href={`/api/plugin/download/${v.id}`}>Descargar</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
