export default async function HardwareViewPage({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/hardware/${params.id}`, {
    cache: "no-store"
  });

  const hw = await res.json();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Hardware: {hw.hardware_id}</h1>

      <p><strong>ID:</strong> {hw.id}</p>
      <p><strong>Licencia:</strong> {hw.licencia?.codigo}</p>
      <p><strong>Usuario:</strong> {hw.usuario?.email}</p>
      <p><strong>Fecha activación:</strong> {hw.fecha_activacion}</p>

      <h2>Historial de uso</h2>
      <ul>
        {hw.uso?.map((u) => (
          <li key={u.id}>
            {u.fecha} — {u.ip} — {u.user_agent}
          </li>
        ))}
      </ul>
    </div>
  );
}
