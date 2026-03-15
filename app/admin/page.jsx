import { createClient } from "@supabase/supabase-js";

export default async function AdminDashboard() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );

  const [{ count: empresas }, { count: licencias }, { count: empleados }, { count: dispositivos }] =
    await Promise.all([
      supabase.from("empresas").select("*", { count: "exact", head: true }),
      supabase.from("licencias").select("*", { count: "exact", head: true }),
      supabase.from("empleados").select("*", { count: "exact", head: true }),
      supabase.from("dispositivos").select("*", { count: "exact", head: true }),
    ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-4 gap-6">
        <Card title="Empresas" value={empresas} />
        <Card title="Licencias" value={licencias} />
        <Card title="Empleados" value={empleados} />
        <Card title="Dispositivos" value={dispositivos} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white shadow p-6 rounded-lg">
      <h3 className="text-gray-600">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
