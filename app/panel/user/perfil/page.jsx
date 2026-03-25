"use client";

import { useEffect, useState } from "react";
import { User, Save } from "lucide-react";

export default function PerfilUsuarioPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // CAMPOS DEL PERFIL
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pais, setPais] = useState("");

  // CAMPOS FISCALES
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [cp, setCp] = useState("");
  const [cif, setCif] = useState("");

  // IDIOMA
  const [idioma, setIdioma] = useState("es");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      const user = data?.user;

      if (user) {
        setEmail(user.email || "");
        setNombre(user.user_metadata?.nombre || "");
        setEmpresa(user.user_metadata?.empresa || "");
        setTelefono(user.user_metadata?.telefono || "");
        setPais(user.user_metadata?.pais || "");

        // Datos fiscales
        setDireccion(user.user_metadata?.direccion || "");
        setCiudad(user.user_metadata?.ciudad || "");
        setCp(user.user_metadata?.cp || "");
        setCif(user.user_metadata?.cif || "");

        // Idioma
        setIdioma(user.user_metadata?.idioma || "es");
      }

      setLoading(false);
    }

    load();
  }, []);

  async function guardar(e) {
    e.preventDefault();
    setSaving(true);

    await fetch("/api/user/perfil", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        empresa,
        telefono,
        pais,
        direccion,
        ciudad,
        cp,
        cif,
        idioma,
      }),
    });

    setSaving(false);
    alert("Datos guardados correctamente.");
  }

  if (loading) return <p>Cargando datos...</p>;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <User size={28} /> Mi Perfil
      </h1>

      <form
        className="space-y-6 bg-gray-200 dark:bg-gray-800 p-8 rounded-lg shadow"
        onSubmit={guardar}
      >
        {/* EMAIL */}
        <div>
          <label className="font-semibold block mb-1">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full border p-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
          />
        </div>

        {/* NOMBRE */}
        <Campo valor={nombre} setValor={setNombre} label="Nombre" placeholder="Tu nombre" />

        {/* EMPRESA */}
        <Campo valor={empresa} setValor={setEmpresa} label="Empresa" placeholder="Nombre empresa" />

        {/* TELEFONO */}
        <Campo valor={telefono} setValor={setTelefono} label="Teléfono" placeholder="+34..." />

        {/* PAIS */}
        <Campo valor={pais} setValor={setPais} label="País" placeholder="España" />

        {/* DIRECCIÓN FISCAL */}
        <h2 className="text-xl font-bold mt-6">Dirección fiscal</h2>

        <Campo valor={direccion} setValor={setDireccion} label="Dirección" placeholder="Calle, número…" />

        <Campo valor={ciudad} setValor={setCiudad} label="Ciudad" placeholder="Barcelona" />

        <Campo valor={cp} setValor={setCp} label="Código postal" placeholder="08000" />

        <Campo valor={cif} setValor={setCif} label="CIF / NIF / VAT" placeholder="ES12345678A" />

        {/* IDIOMA */}
        <div>
          <label className="font-semibold block mb-1">Idioma</label>
          <select
            className="w-full border p-2 rounded dark:bg-gray-900"
            value={idioma}
            onChange={(e) => setIdioma(e.target.value)}
          >
            <option value="es">Español</option>
            <option value="en">Inglés</option>
          </select>
        </div>

        {/* BOTÓN GUARDAR */}
        <button
          type="submit"
          disabled={saving}
          className="btn-primary flex items-center justify-center gap-2 w-full"
        >
          <Save size={18} />
          {saving ? "Guardando..." : "Guardar datos"}
        </button>
      </form>
    </div>
  );
}

function Campo({ valor, setValor, label, placeholder }) {
  return (
    <div>
      <label className="font-semibold block mb-1">{label}</label>
      <input
        className="w-full border p-2 rounded dark:bg-gray-900"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}