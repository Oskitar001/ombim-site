"use client";

export default function ComprarPage() {
  async function comprar() {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
    });

    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-6">Comprar licencia</h1>

      <button
        onClick={comprar}
        className="px-6 py-3 bg-blue-600 text-black rounded text-lg"
      >
        Comprar ahora
      </button>
    </div>
  );
}
