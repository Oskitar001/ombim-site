// eslint.config.js

import next from "eslint-plugin-next";
import globals from "globals";

export default [
  {
    ignores: ["node_modules", ".next", "dist"]
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser
    },
    plugins: {
      next
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "react/jsx-key": "warn",
      "@next/next/no-img-element": "off"
    }
  }
];
