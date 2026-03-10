// prettier.config.js

module.exports = {
  semi: false,               // Sin punto y coma (estilo moderno)
  singleQuote: true,         // Comillas simples
  printWidth: 100,           // Líneas más legibles
  tabWidth: 2,               // Indentación estándar
  trailingComma: 'es5',      // Comas finales donde es seguro
  bracketSpacing: true,      // Espacio entre llaves { así }
  arrowParens: 'avoid',      // Paréntesis solo cuando son necesarios
  jsxSingleQuote: false,     // JSX con comillas dobles (más estándar)
  plugins: ['prettier-plugin-tailwindcss'], // Ordena clases de Tailwind automáticamente
}
