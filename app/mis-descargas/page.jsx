import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export default async function MisDescargasPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return <p>No has iniciado sesión.</p>;
  }

  const user = JSON.parse(sessionCookie.value);

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data: licencias, error } = await supabase
    .from("licencias")
    .select(`
      id,
      email_tekla,
      estado,
      fecha_creacion,
      clave,
      plugin:plugins(id, nombre, archivo_url, video_url),
      tipo:licencia_tipos(id, nombre)
    `)
    .eq("email_tekla", user.email)
    .order("fecha_creacion", { ascending: false });

  if (error) {
    return <p>Error cargando licencias.</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Mis Licencias</h1>

      {(!licencias || licencias.length === 0) && (
        <p>No tienes licencias asociadas a este email.</p>
      )}

      {licencias?.map((lic) => (
        <div
          key={lic.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 15,
            borderRadius: 8,
          }}
        >
          <h2>{lic.plugin?.nombre}</h2>

          <p><strong>Email Tekla:</strong> {lic.email_tekla}</p>
          <p><strong>Tipo de licencia:</strong> {lic.tipo?.nombre}</p>
          <p><strong>Estado:</strong> {lic.estado}</p>
          <p><strong>Fecha:</strong> {lic.fecha_creacion ? new Date(lic.fecha_creacion).toLocaleDateString() : "-"}</p>
          <p><strong>Clave de activación:</strong> {lic.clave || "Pendiente"}</p>

          <div style={{ marginTop: 10 }}>
            {lic.plugin?.archivo_url && (
              <a
                href={lic.plugin.archivo_url}
                download
                style={{
                  padding: "8px 12px",
                  background: "#0070f3",
                  color: "white",
                  borderRadius: 5,
                  textDecoration: "none",
                  marginRight: 10,
                }}
              >
                Descargar plugin
              </a>
            )}

            {lic.plugin?.video_url && (
              <a
                href={lic.plugin.video_url}
                target="_blank"
                style={{
                  padding: "8px 12px",
                  background: "#555",
                  color: "white",
                  borderRadius: 5,
                  textDecoration: "none",
                }}
              >
                Ver vídeo
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
