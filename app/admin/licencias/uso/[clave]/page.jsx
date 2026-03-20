"use client";
import { useEffect, useState } from "react";

export default function UsoLicencia({ params }) {
  const { clave } = params;
  const [usos, setUsos] = useState([]);

  useEffect(() => {
    fetch(`/api/admin/licencias/uso?clave=${clave}`)
      .then(res => res.json())
      .then(data => setUsos(data));
  }, [clave]);

  return (
    <div className="max-w-4xl mx-auto pt-32 px-6">
      <h1 className="text-2xl font-bold mb-4">
        Uso de la licencia: {clave}
      </h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#f3f4f6]Soft dark:bg-[#242424]Soft">
            <th className="p-2 text-left">IP</th>
            <th className="p-2 text-left">User Agent</th>
            <th className="p-2 text-left">Fecha</th>
          </tr>
        </thead>

        <tbody>
          {usos.map(u => (
            <tr key={u.id} className="border-b dark:border-[#3a3a3a]">
              <td className="p-2">{u.ip}</td>
              <td className="p-2">{u.user_agent}</td>
              <td className="p-2">{new Date(u.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
