export default async function LogsListPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/logs`, {
    cache: "no-store"
  });

  const logs = await res.json();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Logs del sistema</h1>

      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Usuario</th>
            <th>IP</th>
            <th>User-Agent</th>
            <th>Clave</th>
            <th>Plugin</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.fecha}</td>
              <td>{log.usuario?.email}</td>
              <td>{log.ip}</td>
              <td>{log.user_agent}</td>
              <td>{log.clave}</td>
              <td>{log.plugin?.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
