"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "El nombre es obligatorio.";
    }

    if (!form.email.trim()) {
      newErrors.email = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Introduce un email válido.";
    }

    if (!form.password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (form.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    if (form.confirm !== form.password) {
      newErrors.confirm = "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (typeof window !== "undefined") {
      const newUser = {
        name: form.name,
        email: form.email
      };
      localStorage.setItem("user", JSON.stringify(newUser));
    }

    setSuccess("Registro completado. Redirigiendo...");

    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className="container mx-auto pt-32 px-6 max-w-lg">
      <h1 className="text-4xl font-bold mb-6 text-center">Crear cuenta</h1>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-xl shadow-lg border border-gray-200">

        <div>
          <label className="block font-medium mb-1">Nombre completo</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Contraseña</label>
          <input
            type="password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Confirmar contraseña</label>
          <input
            type="password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
          {errors.confirm && <p className="text-red-600 text-sm mt-1">{errors.confirm}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-black py-3 rounded-lg font-medium hover:bg-blue-700 transition active:scale-95"
        >
          Crear cuenta
        </button>

        {success && <p className="text-green-600 text-center mt-3">{success}</p>}

        <p className="text-center text-sm mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link href="/acceso" className="text-blue-600 underline hover:opacity-80">
            Inicia sesión aquí
          </Link>
        </p>
      </form>
    </div>
  );
}
