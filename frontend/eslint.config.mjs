import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginFsd from "eslint-plugin-fsd";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "android", "src/routeTree.gen.ts"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: eslintPluginImport,
      fsd: eslintPluginFsd,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
          disallowTypeAnnotations: false,
        },
      ],

      "fsd/hierarchy-import": [
        "error",
        {
          alias: "@",
          ignoreImportPatterns: ["^@/shared", "^@/app"],
        },
      ],
      "fsd/layer-imports": [
        "error",
        {
          alias: "@",
          ignoreImportPatterns: [".css", ".scss", ".less"],
        },
      ],
      "fsd/public-api": ["error", { alias: "@" }],
      "fsd/relative-path": ["error", { alias: "@" }],
    },
  },
);
