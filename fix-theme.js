const fs = require("fs");
const path = require("path");

const TARGET_EXT = [".js", ".jsx", ".ts", ".tsx"];

// Archivos que NO deben ser modificados nunca
const EXCLUDED_FILES = [
  "fix-theme.js",
  "tailwind.config.js",
  "postcss.config.js",
  "next.config.js"
];

// Carpetas que NO deben ser modificadas nunca
const EXCLUDED_FOLDERS = [
  "lib",
  "utils",
  "scripts",
  "public"
];

// Palabras clave que NO deben tocarse nunca (protección hamburguesa animada)
const PROTECTED = [
  "rotate-45",
  "-rotate-45",
  "translate-y-2",
  "-translate-y-2",
  "translate-y-0",
  "w-6",
  "w-7",
  "opacity-0",
  "opacity-100",
  "absolute h-0.5",
  "rounded-full",
  "transition-all",
  "duration-300",
  "bg-black",
  "dark:bg-white"
];

// Reemplazos seguros del tema
const REPLACEMENTS = [
  // 🌑 MODO OSCURO
  ["dark:bg-dark-bg", "dark:bg-[#242424]"],
  ["dark:bg-dark-bgSoft", "dark:bg-[#2e2e2e]"],
  ["dark:border-dark-border", "dark:border-[#3a3a3a]"],
  ["dark:text-dark-text", "dark:text-[#e6e6e6]"],

  // ☀️ MODO CLARO
  ["bg-light-bg", "bg-[#f3f4f6]"],
  ["bg-light-bgSoft", "bg-[#ffffff]"],
  ["border-light-border", "border-[#d1d5db]"],
  ["text-light-text", "text-[#1f2937]"],

  // LIMPIEZA DE COLORES ANTIGUOS
  ["dark:bg-[#111]", "dark:bg-[#242424]"],
  ["dark:bg-[#181818]", "dark:bg-[#242424]"],
  ["dark:bg-gray-900", "dark:bg-[#242424]"],
  ["dark:bg-gray-800", "dark:bg-[#2e2e2e]"],
  ["dark:bg-gray-950", "dark:bg-[#242424]"],
  ["dark:border-gray-700", "dark:border-[#3a3a3a]"],
  ["dark:border-gray-800", "dark:border-[#3a3a3a]"],
  ["dark:text-gray-100", "dark:text-[#e6e6e6]"],
  ["dark:text-gray-300", "dark:text-[#e6e6e6]"],
  ["dark:from-[#111]", "dark:from-[#242424]"],
  ["dark:to-[#111]", "dark:to-[#242424]"],

  ["bg-white", "bg-[#ffffff]"],
  ["bg-gray-50", "bg-[#f3f4f6]"],
  ["bg-gray-100", "bg-[#f3f4f6]"],
  ["border-gray-200", "border-[#d1d5db]"],
  ["border-gray-300", "border-[#d1d5db]"],
  ["text-gray-900", "text-[#1f2937]"],
  ["text-gray-700", "text-[#1f2937]"],
  ["text-gray-600", "text-[#1f2937]"],
  ["from-gray-50", "from-[#f3f4f6]"],
  ["to-gray-100", "to-[#f3f4f6]"]
];

function isProtected(line) {
  return PROTECTED.some(keyword => line.includes(keyword));
}

function processFile(filePath) {
  const fileName = path.basename(filePath);

  // Evitar modificar archivos excluidos
  if (EXCLUDED_FILES.includes(fileName)) {
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");
  let original = content;

  const lines = content.split("\n");

  const newLines = lines.map(line => {
    if (isProtected(line)) return line; // NO tocar hamburguesa

    let modified = line;

    REPLACEMENTS.forEach(([search, replace]) => {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
      modified = modified.replace(regex, replace);
    });

    return modified;
  });

  const finalContent = newLines.join("\n");

  if (finalContent !== original) {
    fs.writeFileSync(filePath, finalContent, "utf8");
    console.log("✔ Modificado:", filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    // Evitar carpetas excluidas
    if (fs.statSync(fullPath).isDirectory()) {
      if (
        ["node_modules", ".next", ".git", ...EXCLUDED_FOLDERS].includes(file)
      ) {
        continue;
      }
      walk(fullPath);
    } else {
      if (TARGET_EXT.includes(path.extname(fullPath))) {
        processFile(fullPath);
      }
    }
  }
}

console.log("🔧 Aplicando reemplazos de tema premium (con protección total y exclusión de carpetas)...");
walk(process.cwd());
console.log("✨ Tema actualizado correctamente");
