const fs = require("fs");
const path = require("path");

// Carpetas a exportar
const carpetas = [
  path.join(process.cwd(), "app"),
  path.join(process.cwd(), "components"),
  path.join(process.cwd(), "hooks"),
  path.join(process.cwd(), "lib")
];

// Solo queremos archivos .js y .jsx
const extensionesPermitidas = [".js", ".jsx"];

// Extensiones a ignorar (binarios)
const binarios = [
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico",
  ".webp", ".mp4", ".mov", ".avi", ".mp3",
  ".woff", ".woff2", ".ttf", ".eot", ".pdf"
];

// Límites
const MAX_LINEAS = 5000;
const MAX_CARACTERES = 10000;

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
    console.log("❌ Error leyendo carpeta:", dir, err.message);
    return;
  }

  for (const elemento of elementos) {
    const ruta = path.join(dir, elemento);

    let stats;
    try {
      stats = fs.statSync(ruta);
    } catch (err) {
      console.log("❌ Error leyendo archivo:", ruta, err.message);
      continue;
    }

    if (stats.isDirectory()) {
      leerCarpeta(ruta);
      continue;
    }

    const ext = path.extname(ruta).toLowerCase();

    if (binarios.includes(ext)) continue;
    if (!extensionesPermitidas.includes(ext)) continue;

    let contenido;
    try {
      contenido = fs.readFileSync(ruta, "utf8");
    } catch (err) {
      console.log("❌ Error leyendo contenido:", ruta, err.message);
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
