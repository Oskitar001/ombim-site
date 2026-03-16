"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PluginDetailPage() {
  const { id } = useParams();

  const [plugin, setPlugin] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [licencias, setLicencias] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Usuario logueado
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setEmpresa(user);

          // Licencias
          const resLic = await fetch(`/api/licencias/byEmpresa?id=${user.id}`);
          const dataLic = await resLic.json();
          setLicencias(dataLic);
        }

        // Cargar plugin individual
        const res = await fetch(`/api/plugin?id=${id}`);
        const data = await res.json();

        setPlugin(data);
      } catch (err) {
        console.error("Error cargando plugin:", err);
      }
    }

    loadData();
  }, [id]);

  const tieneLicencia = () =>
    licencias.some((l) => l.plugin_id === id && l.activa);

  if (!plugin) {
    return (
      <div className="p-10 max-w-4xl mx-auto">
        <p className="text-gray-600">Cargando plugin...</p>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      {/* Título */}
      <h1 className="text-4xl font-bold mb-6">{plugin.nombre}</h1>

      {/* Imagen */}
      {plugin.imagen_url && (
        <img
          src={plugin.imagen_url}
          className="w-full h-72 object-cover rounded mb-6 shadow"
        />
      )}

      {/* Descripción */}
      <p className="text-lg text-gray-700 leading-relaxed mb-8">
        {plugin.descripcion}
      </p>

      {/* Vídeo */}
      {plugin.video_url && (
        <div className="mb-10">
          <iframe
            className="w-full h-72 rounded shadow"
            src={plugin.video_url}
            title="Video del plugin"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* Botones */}
      <div className="flex flex-col gap-4">

        {/* Demo */}
        {plugin.demo_url && (
          <a
            href={plugin.demo_url}
            download
            className="bg-gray-800 text-white px-6 py-3 rounded text-center text-lg"
          >
            Descargar demo
          </a>
        )}

        {/* No logueado */}
        {!empresa && (
          <p className="text-gray-500">
            Inicia sesión para comprar o descargar la versión completa.
          </p>
        )}

        {/* Comprar */}
        {empresa && !tieneLicencia() && (
          <a
            href={`/api/stripe/checkout?plugin_id=${plugin.id}&empresa_id=${empresa.id}`}
            className="bg-green-600 text-white px-6 py-3 rounded text-center text-lg"
          >
            Comprar por {plugin.precio}€
          </a>
        )}

        {/* Descargar versión completa */}
        {empresa && tieneLicencia() && (
          <a
            href={`/api/plugins/download?plugin_id=${plugin.id}&empresa_id=${empresa.id}`}
            className="bg-blue-600 text-white px-6 py-3 rounded text-center text-lg"
          >
            Descargar versión completa
          </a>
        )}

        {/* Volver */}
        <Link
          href="/plugins"
          className="text-gray-600 hover:text-gray-900 underline text-center mt-4"
        >
          ← Volver a plugins
        </Link>
      </div>
    </div>
  );
}
