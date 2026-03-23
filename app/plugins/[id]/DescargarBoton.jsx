"use client";

export default function DescargarBoton({ pluginId }) {
  const handleDownload = () => {
    if (!pluginId) return;
    // Redirige a la ruta de descarga, que registra la descarga y redirige al archivo
    window.location.href = `/api/plugin/download?plugin_id=${pluginId}`;
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Descargar plugin
    </button>
  );
}
