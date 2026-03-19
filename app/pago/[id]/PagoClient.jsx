"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function PagoClient({ plugin, tiposLicencia }) {
  const [tipoLicencia, setTipoLicencia] = useState("");
  const [licencias, setLicencias] = useState([{ email_tekla: "" }]);

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
    <div
      className="
        max-w-2xl mx-auto p-6 rounded-2xl
        bg-light-bgSoft dark:bg-dark-bg
        border border-light-border dark:border-dark-border
        shadow-soft dark:shadow-none
      "
    >
      {/* Título */}
      <h1 className="text-2xl font-bold text-light-text dark:text-dark-text mb-2">
        Comprar {plugin.nombre}
      </h1>

      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Precio por licencia: <strong>{plugin.precio} €</strong>
      </p>

      {/* Tipo de licencia */}
      <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
        Tipo de licencia
      </h3>

      <Select
        value={tipoLicencia}
        onChange={(e) => setTipoLicencia(e.target.value)}
        className="mb-6"
      >
        <option value="">Seleccionar...</option>
        {tiposLicencia.map((tipo) => (
          <option key={tipo.id} value={tipo.id}>
            {tipo.nombre}
          </option>
        ))}
      </Select>

      {/* Licencias */}
      <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
        Licencias
      </h3>

      {licencias.map((lic, index) => (
        <div
          key={index}
          className="
            mb-4 p-4 rounded-xl
            bg-light-bg dark:bg-dark-bgSoft
            border border-light-border dark:border-dark-border
          "
        >
          <label className="block text-light-text dark:text-dark-text mb-1">
            Email Tekla:
          </label>

          <Input
            type="email"
            value={lic.email_tekla}
            onChange={(e) => updateEmail(index, e.target.value)}
          />

          {licencias.length > 1 && (
            <button
              onClick={() => removeRow(index)}
              className="
                mt-3 text-sm text-red-500 hover:text-red-600
                transition
              "
            >
              Eliminar
            </button>
          )}
        </div>
      ))}

      <Button
        onClick={addRow}
        className="mb-6 bg-gray-200 dark:bg-dark-bgSoft text-gray-900 dark:text-dark-text hover:bg-gray-300 dark:hover:bg-dark-border"
      >
        Añadir otra licencia
      </Button>

      <hr className="border-light-border dark:border-dark-border mb-6" />

      <Button onClick={comprar} className="w-full">
        Comprar por transferencia
      </Button>
    </div>
  );
}
