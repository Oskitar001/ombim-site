import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLicenciasList() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) redirect("/login");

  const user = JSON.parse(sessionCookie.value);
  if (user.role !== "admin") redirect("/");

  const origin = process.env.NEXT_PUBLIC_DOMAIN;

  const res = await fetch(`${origin}/api/admin/licencias`, {
    cache: "no-store",
    headers: {
      Cookie: `session=${sessionCookie.value}`
    }
  });

  const licencias = await res.json();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Licencias</h1>

      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Estado</th>
            <th>Usuario</th>
          </tr>
        </thead>

        <tbody>
          {licencias.map((l) => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>{l.codigo}</td>
              <td>{l.estado}</td>
              <td>{l.usuario_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
