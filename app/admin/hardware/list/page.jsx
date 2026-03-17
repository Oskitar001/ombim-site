import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminHardwareList() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) redirect("/login");

  const user = JSON.parse(sessionCookie.value);
  if (user.role !== "admin") redirect("/");

  const origin = process.env.NEXT_PUBLIC_DOMAIN;

  const res = await fetch(`${origin}/api/admin/hardware`, {
    cache: "no-store",
    headers: {
      Cookie: `session=${sessionCookie.value}`
    }
  });

  const hardware = await res.json();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Activaciones de Licencias (Hardware)</h1>

      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Licencia</th>
            <th>Usuario</th>
            <th>Hardware ID</th>
            <th>Fecha Activación</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(hardware) && hardware.length > 0 ? (
            hardware.map((h) => (
              <tr key={h.id}>
                <td>{h.id}</td>
                <td>{h.licencias?.codigo || "—"}</td>
                <td>{h.licencias?.user_id || "—"}</td>
                <td>{h.hardware_id}</td>
                <td>{h.fecha_activacion}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>
                No hay activaciones registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
