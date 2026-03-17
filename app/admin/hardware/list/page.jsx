export default async function HardwareListPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/hardware`, {
    cache: "no-store"
  });

  const hardware = await res.json();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Hardware</h1>

      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Hardware ID</th>
            <th>Licencia</th>
            <th>Usuario</th>
            <th>Fecha activación</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {hardware.map((h) => (
            <tr key={h.id}>
              <td>{h.hardware_id}</td>
              <td>{h.licencia?.codigo}</td>
              <td>{h.usuario?.email}</td>
              <td>{h.fecha_activacion}</td>
              <td>
                <a href={`/admin/hardware/view/${h.id}`}>Ver</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
