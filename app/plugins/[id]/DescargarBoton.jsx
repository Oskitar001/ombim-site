"use client";

export default function DescargarBoton({ pluginId, user }) {
  // Si no hay usuario → no permitir descarga
  if (!user) {
    return (
      <button
        onClick={() => alert("Debes iniciar sesión para descargar este plugin.")}
        className="bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-not-allowed"
      >
        Descargar plugin
      </button>
    );
  }

  // Usuario logueado → permitir descarga
  return (
    <a
      href={`/api/plugin/download?id=${pluginId}`}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition inline-block"
    >
      Descargar plugin
    </a>
  );
}
