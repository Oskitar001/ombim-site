// app/admin/login/page.jsx
"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data.success) {
      setError("Credenciales incorrectas");
      return;
    }

    document.cookie = `admin_token=${data.token}; path=/;`;
    window.location.href = "/admin/dashboard";
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-neutral-900 p-10 rounded-xl w-full max-w-sm border border-neutral-800">
        <h1 className="text-white text-2xl font-semibold mb-6 text-center">
          Panel Admin
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-neutral-800 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 rounded bg-neutral-800 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded font-semibold hover:bg-neutral-200 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
