import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserDownloads() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) redirect("/login");

  const user = JSON.parse(sessionCookie.value);

  const origin = process.env.NEXT_PUBLIC_DOMAIN;

  const res = await fetch(`${origin}/api/user/downloads`, {
    cache: "no-store",
    headers: {
      Cookie: `session=${sessionCookie.value}`
    }
  });

  const descargas = await res.json();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Mis Descargas</h1>

      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Plugin</th>
            <th>Tipo</th>
            <th>Licencia</th>
            <th>Descargar</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(descargas) && descargas.length > 0 ? (
            descargas.map((d, i) => (
              <tr key={i}>
                <td>{d.plugin?.nombre}</td>
                <td>{d.tipo === "compra" ? "Compra" : "Licencia"}</td>
                <td>{d.licencia || "—"}</td>
                <td>
                  {d.plugin?.archivo_descarga ? (
                    <a
                      href={d.plugin.archivo_descarga}
                      download
                      style={{ color: "blue" }}
                    >
                      Descargar
                    </a>
                  ) : (
                    "No disponible"
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "1rem" }}>
                No tienes descargas disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
