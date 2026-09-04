"use client";

import { useEffect, useState } from "react";
import PagoClient from "./PagoClient";

export default function PagoPage({ params }) {
  // ✔ Next.js 15/16 → params es una PROMESA en componentes cliente
  const [id, setId] = useState(null);

  useEffect(() => {
    async function resolver() {
      const resolved = await params;
      setId(resolved.id);
    }
    resolver();
  }, [params]);

  if (!id) return <p>Cargando…</p>;

  return <PagoClient pagoId={id} />;
}