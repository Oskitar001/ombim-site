"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPagosPage() {
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    async function load() {
      const r = await fetch("/api/admin/pagos/list", { credentials: "include" });
      const d = await r.json();
      setPagos(Array.isArray(d) ? d : []);
    }
    load();
  }, []);

  return (
    <>
      <h3>Pagos</h3>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Plugin</th>
            <th>Licencias</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {pagos.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.user_id}</td>
              <td>{p.plugin_id}</td>
              <td>{p.cantidad_licencias}</td>
              <td>{p.estado}</td>
              <td>{new Date(p.fecha).toLocaleString()}</td>
              <td>
                <Link href={`/panel/admin/pagos/${p.id}`}>Ver</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}