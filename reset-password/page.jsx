"use client";

import { useState } from "react";
import { supabaseRoute } from "@/lib/supabaseRoute";

export default function ResetPasswordPage() {
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");

  async function cambiar() {
    setMsg("");
    const supabase = supabaseRoute();

    const { error } = await supabase.auth.updateUser({
      password: pass,
    });

    if (error) {
      setMsg("Error: " + error.message);
      return;
    }

    setMsg("Contraseña actualizada. Ya puedes iniciar sesión.");
  }

  return (
    <div className="space-y-6 p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Nueva contraseña</h2>

      <input
        type="password"
        className="border p-2 w-full dark:bg-gray-900"
        placeholder="Nueva contraseña"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
      />

      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={cambiar}
      >
        Guardar contraseña
      </button>

      {msg && <p className="text-green-600">{msg}</p>}
    </div>
  );
}