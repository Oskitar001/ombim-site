import PagoClient from "./PagoClient";

export default function PagoPage({ params }) {
  const { id } = params;

  return <PagoClient pagoId={id} />;
}
