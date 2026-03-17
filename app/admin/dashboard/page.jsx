export default async function AdminDashboardPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/datos`, {
    cache: "no-store"
  });

  const stats = await res.json();

  const cards = [
    { title: "Usuarios", value: stats.usuarios },
    { title: "Licencias", value: stats.licencias },
    { title: "Activaciones", value: stats.activaciones },
    { title: "Hardware", value: stats.hardware },
    { title: "Logs", value: stats.logs },
    { title: "Versiones", value: stats.versiones }
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "1rem",
        marginTop: "2rem"
      }}>
        {cards.map((c) => (
          <div key={c.title} style={{
            padding: "1.5rem",
            borderRadius: "8px",
            background: "#f5f5f5",
            textAlign: "center"
          }}>
            <h2>{c.title}</h2>
            <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
