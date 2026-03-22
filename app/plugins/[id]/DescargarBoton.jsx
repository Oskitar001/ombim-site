"use client";

export default function DescargarBoton({ pluginId }) {
  const descargar = () => {
    window.location.href = `/api/plugin/download?plugin_id=${pluginId}`;
  };

  return (
    <button
      onClick={descargar}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Descargar plugin
    </button>
  );
}
