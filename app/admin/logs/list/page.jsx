import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLogsList() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) redirect("/login");

  const user = JSON.parse(sessionCookie.value);
  if (user.role !== "admin") redirect("/");

  const origin = process.env.NEXT_PUBLIC_DOMAIN;

  const res = await fetch(`${origin}/api/admin/logs`, {
    cache: "no-store",
    headers: {
      Cookie: `session=${sessionCookie.value}`
    }
  });

  const logs = await res.json();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Logs de Uso de Licencias</h1>

      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Clave</th>
            <th>Usuario</th>
            <th>IP</th>
            <th>User Agent</th>
            <th>Fecha</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(logs) && logs.length > 0 ? (
            logs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.clave}</td>
                <td>{log.claves_entregadas?.user_id || "—"}</td>
                <td>{log.ip}</td>
                <td>{log.user_agent}</td>
                <td>{log.fecha}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                No hay registros de uso
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
