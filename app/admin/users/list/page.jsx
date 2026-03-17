import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminUsersList() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) redirect("/login");

  const user = JSON.parse(sessionCookie.value);
  if (user.role !== "admin") redirect("/");

  const origin = process.env.NEXT_PUBLIC_DOMAIN;

  const res = await fetch(`${origin}/api/admin/users`, {
    cache: "no-store",
    headers: {
      Cookie: `session=${sessionCookie.value}`
    }
  });

  const users = await res.json();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Usuarios</h1>

      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Nombre</th>
            <th>Rol</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.nombre}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
