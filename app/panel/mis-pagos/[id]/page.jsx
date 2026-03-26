// /app/panel/mis-pagos/[id]/page.jsx
import { use } from "react";
import PagoClient from "./PagoClient";

export default function PagoPage({ params }) {
  // ⬇⬇⬇ FIX OBLIGATORIO EN NEXT 16
  const { id } = use(params);

  return <PagoClient pagoId={id} />;
}