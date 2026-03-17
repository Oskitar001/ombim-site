export default async function LicenseViewPage({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/licencias/${params.id}`, {
    cache: "no-store"
  });

  const lic = await res.json();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Licencia: {lic.codigo}</h1>

      <p><strong>Usuario:</strong> {lic.auth?.users?.email}</p>
      <p><strong>Estado:</strong> {lic.estado}</p>
      <p><strong>Tipo:</strong> {lic.licencia_tipos?.nombre}</p>
      <p><strong>Expira:</strong> {lic.fecha_expiracion || "—"}</p>

      <h2>Activaciones</h2>
      <ul>
        {lic.licencia_activaciones?.map((a) => (
          <li key={a.hardware_id}>
            {a.hardware_id} — {a.fecha_activacion}
          </li>
        ))}
      </ul>
    </div>
  );
}
