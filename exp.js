const fs = require("fs");
const path = require("path");

// Carpetas a exportar
const carpetas = [
  path.join(process.cwd(), "app"),
  path.join(process.cwd(), "src/app"),   // ← por si usas src/
  path.join(process.cwd(), "api"),       // ← por si usas api/ fuera
  path.join(process.cwd(), "server"),    // ← por si usas server/
  path.join(process.cwd(), "components"),
  path.join(process.cwd(), "hooks"),
  path.join(process.cwd(), "lib")
];

// Extensiones permitidas
const extensionesPermitidas = [
  ".js", ".jsx",
  ".ts", ".tsx",
  ".mjs", ".cjs"
];

// Ficheros especiales que Next usa como APIs aunque no sean .js plano
const nombresEspeciales = ["route.js", "route.ts", "index.js", "index.ts"];

// Binarios
const binarios = [
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",
  ".webp", ".mp4", ".mov", ".avi", ".mp3",
  ".woff", ".woff2", ".ttf", ".eot", ".pdf"
];

const MAX_LINEAS = 5000;
const MAX_CARACTERES = 100000;

let parte = 1;
let buffer = "";
let lineasActuales = 0;
let caracteresActuales = 0;

function guardarParte() {
  const nombre = `resultado_parte_${parte}.txt`;
  fs.writeFileSync(nombre, buffer);
  console.log("📄 Generado:", nombre);

  parte++;
  buffer = "";
  lineasActuales = 0;
  caracteresActuales = 0;
}

function agregarContenido(texto) {
  const lineas = texto.split("\n").length;
  const chars = texto.length;

  if (
    lineasActuales + lineas > MAX_LINEAS ||
    caracteresActuales + chars > MAX_CARACTERES
  ) {
    guardarParte();
  }

  buffer += texto + "\n\n";
  lineasActuales += lineas;
  caracteresActuales += chars;
}

function leerCarpeta(dir) {
  let elementos;

  try {
    elementos = fs.readdirSync(dir);
  } catch (err) {
    return;
  }

  for (const elemento of elementos) {
    const ruta = path.join(dir, elemento);

    let stats;
    try {
      stats = fs.statSync(ruta);
    } catch (err) {
      continue;
    }

    if (stats.isDirectory()) {
      leerCarpeta(ruta);
      continue;
    }

    const nombreArchivo = path.basename(ruta);
    const ext = path.extname(ruta).toLowerCase();

    if (binarios.includes(ext)) continue;

    if (
      !extensionesPermitidas.includes(ext) &&
      !nombresEspeciales.includes(nombreArchivo)
    ) {
      continue;
    }

    let contenido;
    try {
      contenido = fs.readFileSync(ruta, "utf8");
    } catch {
      continue;
    }

    const encabezado = `
============================================================
📄 ARCHIVO: ${ruta}
============================================================

`;

    agregarContenido(encabezado + contenido);
  }
}

console.log("📁 Exportando carpetas:", carpetas);

for (const carpeta of carpetas) {
  leerCarpeta(carpeta);
}

if (buffer.trim().length > 0) guardarParte();