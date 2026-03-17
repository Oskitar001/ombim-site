export default async function UsersListPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/datos`, {
    cache: "no-store"
  });

  const { users } = await res.json();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Usuarios</h1>

      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>ID</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.id}</td>
              <td>
                <a href={`/admin/users/view/${u.id}`}>Ver</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
