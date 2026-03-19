"use client";
import { useState } from "react";

export default function PagoClient({ plugin, tiposLicencia }) {
  // Tipo de licencia global
  const [tipoLicencia, setTipoLicencia] = useState("");

  // Lista de licencias (cada una con email Tekla)
  const [licencias, setLicencias] = useState([
    { email_tekla: "" }
  ]);

  const addRow = () => {
    setLicencias([...licencias, { email_tekla: "" }]);
  };

  const removeRow = (index) => {
    setLicencias(licencias.filter((_, i) => i !== index));
  };

  const updateEmail = (index, value) => {
    const updated = [...licencias];
    updated[index].email_tekla = value;
    setLicencias(updated);
  };

  const comprar = async () => {
    const res = await fetch("/api/transferencia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plugin_id: plugin.id,
        tipo_id: tipoLicencia,
        licencias
      })
    });

    const data = await res.json();
    console.log("Respuesta:", data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Comprar {plugin.nombre}</h1>
      <p>Precio por licencia: {plugin.precio} €</p>

      <h3>Tipo de licencia</h3>
      <select
        value={tipoLicencia}
        onChange={(e) => setTipoLicencia(e.target.value)}
      >
        <option value="">Seleccionar...</option>

        {tiposLicencia.map((tipo) => (
          <option key={tipo.id} value={tipo.id}>
            {tipo.nombre}
          </option>
        ))}
      </select>

      <h3 style={{ marginTop: 20 }}>Licencias</h3>

      {licencias.map((lic, index) => (
        <div key={index} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          
          <label>Email Tekla:</label>
          <input
            type="email"
            value={lic.email_tekla}
            onChange={(e) => updateEmail(index, e.target.value)}
          />

          {licencias.length > 1 && (
            <button onClick={() => removeRow(index)}>Eliminar</button>
          )}
        </div>
      ))}

      <button onClick={addRow}>Añadir otra licencia</button>

      <hr />

      <button onClick={comprar}>Comprar por transferencia</button>
    </div>
  );
}
