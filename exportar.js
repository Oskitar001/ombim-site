const fs = require("fs");
const path = require("path");

// Carpetas a exportar
const carpetas = [
  path.join(process.cwd(), "app"),
  path.join(process.cwd(), "src/app"),   // por si usas src/
  path.join(process.cwd(), "api"),       // por si usas api/
  path.join(process.cwd(), "server"),    // por si usas server/
  path.join(process.cwd(), "components"),
  path.join(process.cwd(), "hooks"),
  path.join(process.cwd(), "lib")
];

// Extensiones permitidas
const extensionesPermitidas = [
  ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"
];

// Binarios (no copiar)
const binarios = [
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",
  ".webp", ".mp4", ".mov", ".avi", ".mp3",
  ".woff", ".woff2", ".ttf", ".eot", ".pdf"
];

const carpetaExport = path.join(process.cwd(), "export");

function copiarArchivo(origen, destino) {
  const destDir = path.dirname(destino);
  fs.mkdirSync(destDir, { recursive: true });

  fs.copyFileSync(origen, destino);
  console.log("📄 Copiado:", destino);
}

function procesarCarpeta(origenBase, carpetaActual) {
  const rutaCompleta = path.join(origenBase, carpetaActual);

  if (!fs.existsSync(rutaCompleta)) return;

  const elementos = fs.readdirSync(rutaCompleta);

  for (const elemento of elementos) {
    const origen = path.join(rutaCompleta, elemento);
    const relativo = path.join(carpetaActual, elemento);
    const destino = path.join(carpetaExport, relativo);

    const stats = fs.statSync(origen);

    if (stats.isDirectory()) {
      procesarCarpeta(origenBase, relativo);
    } else {
      const ext = path.extname(origen).toLowerCase();

      if (binarios.includes(ext)) continue;

      if (!extensionesPermitidas.includes(ext)) continue;

      copiarArchivo(origen, destino);
    }
  }
}

console.log("📁 Exportando proyecto a /export ...");

if (fs.existsSync(carpetaExport)) {
  fs.rmSync(carpetaExport, { recursive: true, force: true });
}

fs.mkdirSync(carpetaExport, { recursive: true });

for (const carpeta of carpetas) {
  if (fs.existsSync(carpeta)) {
    console.log("➡ Carpeta encontrada:", carpeta);
    procesarCarpeta(carpeta, "");
  }
}

console.log("✅ Exportación completada. Archivos guardados en /export");