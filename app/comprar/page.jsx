"use client";

import { useState } from "react";

export default function ComprarPage() {
  const [plugin, setPlugin] = useState("Union2Partes");
  const [cantidad, setCantidad] = useState(1);

  async function iniciarCheckout() {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plugin, cantidad }),
    });

    const data = await res.json();
    window.location.href = data.url;
  }

  return (
    <div className="max-w-xl mx-auto mt-20 bg-[#f3f4f6]Soft dark:bg-[#1a1a1a] shadow p-10 rounded-lg border border-[#d1d5db] dark:border-[#3a3a3a]">
      <h1 className="text-3xl font-bold mb-6 text-[#1f2937] dark:text-[#e6e6e6]">
        Comprar licencia
      </h1>

      <label className="block mb-4">
        <span className="text-[#1f2937] dark:text-[#e6e6e6]">Plugin</span>
        <select
          className="w-full mt-2 p-3 border border-[#d1d5db] dark:border-gray-600 bg-[#f3f4f6]Soft dark:bg-[#242424] text-[#1f2937] dark:text-[#e6e6e6] rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          value={plugin}
          onChange={(e) => setPlugin(e.target.value)}
        >
          <option value="Union2Partes">Union 2 Partes</option>
        </select>
      </label>

      <label className="block mb-6">
        <span className="text-[#1f2937] dark:text-[#e6e6e6]">Número de empleados</span>
        <input
          type="number"
          min="1"
          className="w-full mt-2 p-3 border border-[#d1d5db] dark:border-gray-600 bg-[#f3f4f6]Soft dark:bg-[#242424] text-[#1f2937] dark:text-[#e6e6e6] rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
      </label>

      <button
        onClick={iniciarCheckout}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition active:scale-95"
      >
        Comprar ahora
      </button>
    </div>
  );
}
