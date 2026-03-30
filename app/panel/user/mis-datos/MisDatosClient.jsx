"use client";

import { useEffect, useState } from "react";

/* ======================================================
   MIS DATOS — ESTILO PREMIUM (igual que panel admin)
====================================================== */

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
  // CARGA INICIAL (AUTH + FACT)
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

  if (loading)
    return <p className="p-4 text-gray-600 dark:text-gray-300">Cargando…</p>;

  return (
    <div className="p-4 space-y-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mis datos</h1>

      {/* -------------------- DATOS DE USUARIO -------------------- */}
      <UserSection title="Datos de usuario">
        {/* EMAIL */}
        <Field label="Email">
          <input
            disabled
            className="input-premium-disabled"
            value={usuario.email}
          />
        </Field>

        <EditableField
          label="Nombre"
          value={userForm.nombre}
          onChange={(v) => updateUserField("nombre", v)}
          editable={editUser}
        />

        <EditableField
          label="Empresa"
          value={userForm.empresa}
          onChange={(v) => updateUserField("empresa", v)}
          editable={editUser}
        />

        <EditableField
          label="Teléfono"
          value={userForm.telefono}
          onChange={(v) => updateUserField("telefono", v)}
          editable={editUser}
        />

        <EditableField
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
      </UserSection>

      {/* -------------------- FACTURACIÓN -------------------- */}
      <UserSection title="Datos de facturación">
        <EditableField
          label="Nombre / Razón social"
          value={factForm.nombre}
          onChange={(v) => updateFactField("nombre", v)}
          editable={editFact}
        />

        <EditableField
          label="NIF / CIF"
          value={factForm.nif}
          onChange={(v) => updateFactField("nif", v)}
          editable={editFact}
        />

        <EditableField
          label="Dirección"
          value={factForm.direccion}
          onChange={(v) => updateFactField("direccion", v)}
          editable={editFact}
        />

        <EditableField
          label="Ciudad"
          value={factForm.ciudad}
          onChange={(v) => updateFactField("ciudad", v)}
          editable={editFact}
        />

        <EditableField
          label="Código Postal"
          value={factForm.cp}
          onChange={(v) => updateFactField("cp", v)}
          editable={editFact}
        />

        <EditableField
          label="País"
          value={factForm.pais}
          onChange={(v) => updateFactField("pais", v)}
          editable={editFact}
        />

        <EditableField
          label="Teléfono"
          value={factForm.telefono}
          onChange={(v) => updateFactField("telefono", v)}
          editable={editFact}
        />

        {/* Checkbox */}
        <div className="flex items-center mt-2">
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
      </UserSection>
    </div>
  );
}

/* ======================================================
   COMPONENTES PREMIUM — INTEGRACIÓN CORRECTA
====================================================== */

function UserSection({ title, children }) {
  return (
    <section
      className="
        bg-white dark:bg-gray-900 
        border border-gray-300 dark:border-gray-700
        rounded-2xl shadow-lg p-6 space-y-6
        transition-all
      "
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 pb-3 border-b border-gray-200 dark:border-gray-700">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {children}
    </div>
  );
}

function EditableField({ label, value, onChange, editable }) {
  return (
    <Field label={label}>
      <input
        disabled={!editable}
        className={`
          w-full px-4 py-2 rounded-xl
          bg-gray-100 dark:bg-gray-800
          border border-gray-300 dark:border-gray-700 
          shadow-sm
          focus:ring-2 focus:ring-blue-600
          transition
          text-gray-900 dark:text-gray-200
          ${!editable ? "opacity-60 cursor-not-allowed" : ""}
        `}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

function BotonesEditarGuardar({ editMode, onEdit, onCancel, onSave }) {
  if (!editMode)
    return (
      <button
        onClick={onEdit}
        className="
          px-5 py-2.5 rounded-xl font-semibold
          bg-blue-600 text-white 
          hover:bg-blue-700 active:scale-95
          shadow-md hover:shadow-lg
          transition-all duration-150
        "
      >
        Editar
      </button>
    );

  return (
    <div className="flex gap-4 pt-2">
      <button
        onClick={onCancel}
        className="
          px-5 py-2.5 rounded-xl font-semibold
          bg-gray-500 text-white 
          hover:bg-gray-600 active:scale-95
          shadow-md hover:shadow-lg
          transition-all duration-150
        "
      >
        Cancelar
      </button>

      <button
        onClick={onSave}
        className="
          px-5 py-2.5 rounded-xl font-semibold
          bg-green-600 text-white 
          hover:bg-green-700 active:scale-95
          shadow-md hover:shadow-lg
          transition-all duration-150
        "
      >
        Guardar
      </button>
    </div>
  );
}

/* ======================================================
   ESTILOS PREMIUM REUTILIZABLES
====================================================== */

globalThis["input-premium"] = `
  w-full px-4 py-2 rounded-xl
  bg-gray-100 dark:bg-gray-800 
  border border-gray-300 dark:border-gray-700
  shadow-sm
  focus:ring-2 focus:ring-blue-600
  transition
  text-gray-900 dark:text-gray-200
`;

globalThis["input-premium-disabled"] = `
  w-full px-4 py-2 rounded-xl
  bg-gray-200 dark:bg-gray-700
  border border-gray-300 dark:border-gray-600
  text-gray-600 dark:text-gray-400
  opacity-70 cursor-not-allowed
`;

globalThis["btn-premium"] = `
  px-5 py-2.5 rounded-xl font-semibold text-white
  shadow-md hover:shadow-lg active:scale-95
  transition-all duration-150
`;

/* ======================================================
   ESTILOS PREMIUM REUTILIZABLES
====================================================== */

/* input normal */
const inputPremium = `
  w-full px-3 py-2 rounded-lg
  bg-gray-100 dark:bg-gray-800
  border border-gray-300 dark:border-gray-700
  focus:ring-2 focus:ring-blue-600
  transition
`;

/* input disabled */
const inputDisabled = `
  w-full px-3 py-2 rounded-lg
  bg-gray-200 dark:bg-gray-700
  text-gray-600 dark:text-gray-400
  border border-gray-300 dark:border-gray-600
`;

/* botones */
const btnPremium = `
  px-4 py-2 rounded-lg text-white font-semibold shadow
  transition
`;

/* Para poder usar las clases */
globalThis["input-premium"] = inputPremium;
globalThis["input-premium-disabled"] = inputDisabled;
globalThis["btn-premium"] = btnPremium;