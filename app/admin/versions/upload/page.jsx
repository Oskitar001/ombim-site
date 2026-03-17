"use client";

import { useState } from "react";

export default function VersionUploadPage() {
  const [file, setFile] = useState(null);
  const [version, setVersion] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("version", version);
    formData.append("notes", notes);

    await fetch("/api/plugin/upload", {
      method: "POST",
      body: formData
    });

    alert("Versión subida correctamente");
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Subir nueva versión</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
        
        <label>
          Archivo del plugin:
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </label>

        <label>
          Versión:
          <input
            type="text"
            placeholder="1.0.0"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          />
        </label>

        <label>
          Notas:
          <textarea
            placeholder="Cambios en esta versión..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>

        <button type="submit">Subir versión</button>
      </form>
    </div>
  );
}
