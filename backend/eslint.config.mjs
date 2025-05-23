import globals from "globals";
import pluginJs from "@eslint/js";
import pluginNode from "eslint-plugin-node";
import prettierPluginRecommended from "eslint-plugin-prettier/recommended";

export default [
  { languageOptions: { globals: { ...globals.node, node: true } } }, // Ensures Node.js globals and `node` is true for plugin-node
  pluginJs.configs.recommended,
  pluginNode.configs.recommended, // Or pluginNode.configs['flat/recommended'] if available and preferred
  prettierPluginRecommended, // Make sure this is last
  {
    // Custom rules can go here if needed
    rules: {
      "node/no-unpublished-require": "off", // Often useful to turn off for scripts or if using a monorepo structure
      // Add any other specific overrides
    }
  },
  {
    ignores: ["node_modules/", ".eslintcache", "dist/"] // Files/dirs to ignore
  }
];
