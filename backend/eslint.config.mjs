import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 2022,
      sourceType: "module",
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      // Add any specific overrides here
      "no-unused-vars": "warn",
      "no-console": "off", // Allow console.log in backend
    },
  },
  {
    ignores: ["node_modules/", ".eslintcache", "dist/"],
  },
];
