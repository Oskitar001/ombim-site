import { requireAdmin } from "@/lib/checkAdmin";

export const dynamic = "force-dynamic";

export default async function AdminPagoDetallePage({ params }) {
  const auth = await requireAdmin();
  if (!auth.ok) return null;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/pagos/${params.id}`,
    { cache: "no-store" }
  );

  const { pago } = await res.json();
  if (!pago) return <p>Pago no encontrado</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Pago {pago.id}</h1>
      {/* … resto idéntico pero seguro */}
    </div>
  );
}