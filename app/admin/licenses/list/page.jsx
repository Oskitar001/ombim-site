export default async function LicensesListPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/licencias`, {
    cache: "no-store"
  });

  const licencias = await res.json();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Licencias</h1>

      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Clave</th>
            <th>Usuario</th>
            <th>Estado</th>
            <th>Expira</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {licencias.map((lic) => (
            <tr key={lic.id}>
              <td>{lic.codigo}</td>
              <td>{lic.auth?.users?.email}</td>
              <td>{lic.estado}</td>
              <td>{lic.fecha_expiracion || "—"}</td>
              <td>
                <a href={`/admin/licenses/view/${lic.id}`}>Ver</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
