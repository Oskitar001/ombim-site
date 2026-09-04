"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pais, setPais] = useState("");
  const [idioma, setIdioma] = useState("es");

  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setOk("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        nombre,
        empresa,
        telefono,
        pais,
        idioma
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Error al registrarse");
      return;
    }

    setOk("Registro completado. Revisa tu email para confirmar tu cuenta.");
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Crear cuenta</h2>

      <form onSubmit={handleRegister} className="space-y-4">
        
        <input
          type="text"
          placeholder="Nombre"
          className="border p-2 rounded w-full"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="text"
          placeholder="Empresa"
          className="border p-2 rounded w-full"
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
        />

        <input
          type="text"
          placeholder="Teléfono"
          className="border p-2 rounded w-full"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <input
          type="text"
          placeholder="País"
          className="border p-2 rounded w-full"
          value={pais}
          onChange={(e) => setPais(e.target.value)}
        />

        <select
          className="border p-2 rounded w-full"
          value={idioma}
          onChange={(e) => setIdioma(e.target.value)}
        >
          <option value="es">Español</option>
          <option value="en">Inglés</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="border p-2 rounded w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Registrarse
        </button>

        {error && <p className="text-red-600">{error}</p>}
        {ok && <p className="text-green-600">{ok}</p>}
      </form>
    </div>
  );
}