// /app/panel/mis-pagos/[id]/page.jsx
import PagoClient from "./PagoClient";

export default function PagoPage({ params }) {
  return <PagoClient pagoId={params.id} />;
}