"use client";

export default function DescargarBoton({ pluginId }) {
  const handleDownload = () => {
    if (!pluginId) return;
    window.location.href = `/api/plugin/download?plugin_id=${pluginId}`;
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
    >
      Descargar plugin
    </button>
  );
}