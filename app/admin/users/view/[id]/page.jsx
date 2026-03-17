export default async function UserViewPage({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/usuario/${params.id}`, {
    cache: "no-store"
  });

  const user = await res.json();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Usuario: {user.email}</h1>

      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Nombre:</strong> {user.nombre || "—"}</p>

      <h2>Licencias</h2>
      <ul>
        {user.licencias?.map((l) => (
          <li key={l.id}>
            <a href={`/admin/licenses/view/${l.id}`}>
              {l.codigo} — {l.estado}
            </a>
          </li>
        ))}
      </ul>

      <h2>Pagos</h2>
      <ul>
        {user.pagos?.map((p) => (
          <li key={p.id}>
            {p.estado} — {p.fecha}
          </li>
        ))}
      </ul>
    </div>
  );
}
