import { requireAdmin } from "@/lib/checkAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminLicenciasTiposPage() {
  const admin = await requireAdmin();
  if (!admin) {
    return <div className="pt-32 px-6">Acceso denegado.</div>;
  }

  const { data: tipos, error } = await supabaseAdmin
    .from("licencias_tipos")
    .select("id, nombre, descripcion, precio, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="pt-32 px-6">Error al cargar tipos de licencia.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto pt-32 px-6">
      <h1 className="text-2xl font-bold mb-4">Tipos de licencia</h1>

      {!tipos?.length && <p>No hay tipos de licencia.</p>}

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Descripción</th>
            <th className="p-2 border">Precio</th>
            <th className="p-2 border">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {tipos?.map((t) => (
            <tr key={t.id}>
              <td className="p-2 border">{t.id}</td>
              <td className="p-2 border">{t.nombre}</td>
              <td className="p-2 border">{t.descripcion}</td>
              <td className="p-2 border">{t.precio}</td>
              <td className="p-2 border">
                {t.created_at ? new Date(t.created_at).toLocaleString() : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
