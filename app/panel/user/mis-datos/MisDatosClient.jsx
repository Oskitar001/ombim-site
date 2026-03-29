"use client";

import { useEffect, useState } from "react";

export default function MisDatosClient() {
  const [loading, setLoading] = useState(true);

  // USER (AUTH)
  const [usuario, setUsuario] = useState(null);
  const [userForm, setUserForm] = useState({
    nombre: "",
    empresa: "",
    telefono: "",
    pais: "",
  });
  const [editUser, setEditUser] = useState(false);

  // FACTURACION
  const [factForm, setFactForm] = useState({
    nombre: "",
    nif: "",
    direccion: "",
    ciudad: "",
    cp: "",
    pais: "",
    telefono: "",
  });
  const [editFact, setEditFact] = useState(false);

  const [usarMismosDatos, setUsarMismosDatos] = useState(false);

  // ===============================================
  // CARGA INICIAL
  // ===============================================
  useEffect(() => {
    async function load() {
      try {
        // Usuario
        const r1 = await fetch("/api/auth/me", { cache: "no-store" });
        const d1 = await r1.json();

        if (!d1.user) {
          setLoading(false);
          return;
        }

        setUsuario(d1.user);

        setUserForm({
          nombre: d1.user.user_metadata?.nombre ?? "",
          empresa: d1.user.user_metadata?.empresa ?? "",
          telefono: d1.user.user_metadata?.telefono ?? "",
          pais: d1.user.user_metadata?.pais ?? "",
        });

        // FACTURACIÓN
        const r2 = await fetch("/api/user/facturacion", { cache: "no-store" });
        const d2 = await r2.json();

        setFactForm({
          nombre: d2?.nombre ?? "",
          nif: d2?.nif ?? "",
          direccion: d2?.direccion ?? "",
          ciudad: d2?.ciudad ?? "",
          cp: d2?.cp ?? "",
          pais: d2?.pais ?? "",
          telefono: d2?.telefono ?? "",
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // ===============================================
  // HANDLERS CORRECTOS
  // ===============================================
  const updateUserField = (key, value) =>
    setUserForm((prev) => ({ ...prev, [key]: value }));

  const updateFactField = (key, value) =>
    setFactForm((prev) => ({ ...prev, [key]: value }));

  // ===============================================
  // GUARDAR DATOS USUARIO
  // ===============================================
  async function guardarUsuario() {
    const res = await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userForm),
    });

    if (res.ok) {
      setEditUser(false);
      location.reload();
    }
  }

  // ===============================================
  // GUARDAR FACTURACION
  // ===============================================
  async function guardarFacturacion() {
    const payload = { ...factForm, usarDatosUsuario: usarMismosDatos };

    const res = await fetch("/api/facturacion/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setEditFact(false);
      location.reload();
    }
  }

  if (loading) return <p className="p-4">Cargando…</p>;

  return (
    <div className="p-4 space-y-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mis datos</h1>

      {/* -------------------- DATOS DE USUARIO -------------------- */}
      <section className="p-6 rounded-lg bg-white shadow dark:bg-gray-800 space-y-4">
        <h2 className="text-xl font-bold">Datos de usuario</h2>

        <div>
          <label className="font-semibold">Email</label>
          <input
            disabled
            className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700"
            value={usuario.email}
          />
        </div>

        <CampoEditable
          label="Nombre"
          value={userForm.nombre}
          onChange={(v) => updateUserField("nombre", v)}
          editable={editUser}
        />

        <CampoEditable
          label="Empresa"
          value={userForm.empresa}
          onChange={(v) => updateUserField("empresa", v)}
          editable={editUser}
        />

        <CampoEditable
          label="Teléfono"
          value={userForm.telefono}
          onChange={(v) => updateUserField("telefono", v)}
          editable={editUser}
        />

        <CampoEditable
          label="País"
          value={userForm.pais}
          onChange={(v) => updateUserField("pais", v)}
          editable={editUser}
        />

        <BotonesEditarGuardar
          editMode={editUser}
          onEdit={() => setEditUser(true)}
          onCancel={() => setEditUser(false)}
          onSave={guardarUsuario}
        />
      </section>

      {/* -------------------- FACTURACIÓN -------------------- */}
      <section className="p-6 rounded-lg bg-white shadow dark:bg-gray-800 space-y-4">
        <h2 className="text-xl font-bold">Datos de facturación</h2>

        <CampoEditable
          label="Nombre / Razón social"
          value={factForm.nombre}
          onChange={(v) => updateFactField("nombre", v)}
          editable={editFact}
        />

        <CampoEditable
          label="NIF / CIF"
          value={factForm.nif}
          onChange={(v) => updateFactField("nif", v)}
          editable={editFact}
        />

        <CampoEditable
          label="Dirección"
          value={factForm.direccion}
          onChange={(v) => updateFactField("direccion", v)}
          editable={editFact}
        />

        <CampoEditable
          label="Ciudad"
          value={factForm.ciudad}
          onChange={(v) => updateFactField("ciudad", v)}
          editable={editFact}
        />

        <CampoEditable
          label="Código Postal"
          value={factForm.cp}
          onChange={(v) => updateFactField("cp", v)}
          editable={editFact}
        />

        <CampoEditable
          label="País"
          value={factForm.pais}
          onChange={(v) => updateFactField("pais", v)}
          editable={editFact}
        />

        <CampoEditable
          label="Teléfono"
          value={factForm.telefono}
          onChange={(v) => updateFactField("telefono", v)}
          editable={editFact}
        />

        {/* Checkbox */}
        <div className="flex items-center mt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              disabled={!editFact}
              checked={usarMismosDatos}
              onChange={(e) => {
                const checked = e.target.checked;
                setUsarMismosDatos(checked);

                if (checked) {
                  setFactForm((prev) => ({
                    ...prev,
                    nombre: userForm.nombre || prev.nombre,
                    pais: userForm.pais || prev.pais,
                    telefono: userForm.telefono || prev.telefono,
                  }));
                }
              }}
              className="w-4 h-4 rounded border-gray-400 accent-blue-600"
            />
            Usar también los datos del usuario
          </label>
        </div>

        <BotonesEditarGuardar
          editMode={editFact}
          onEdit={() => setEditFact(true)}
          onCancel={() => setEditFact(false)}
          onSave={guardarFacturacion}
        />
      </section>
    </div>
  );
}

// -----------------------------------------------------------------------------
// AUXILIARES
// -----------------------------------------------------------------------------

function CampoEditable({ label, value, onChange, editable }) {
  return (
    <div>
      <label className="font-semibold">{label}</label>
      <input
        disabled={!editable}
        className="w-full p-2 border rounded dark:bg-gray-900"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function BotonesEditarGuardar({ editMode, onEdit, onCancel, onSave }) {
  if (!editMode)
    return (
      <button
        onClick={onEdit}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Editar
      </button>
    );

  return (
    <div className="flex gap-3">
      <button
        onClick={onCancel}
        className="px-4 py-2 bg-gray-400 text-white rounded"
      >
        Cancelar
      </button>

      <button
        onClick={onSave}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Guardar
      </button>
    </div>
  );
}