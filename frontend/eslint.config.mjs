import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginFsd from "eslint-plugin-fsd"; // Добавляем плагин FSD

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    plugins: {
      import: eslintPluginImport,
      fsd: eslintPluginFsd, // Регистрируем плагин FSD
    },
    rules: {
      // Требует указания type для импорта типов
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      
      // Дополнительные полезные правила для типов
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
          disallowTypeAnnotations: false,
        },
      ],

      // Правила FSD
      "fsd/hierarchy-import": ["error", {
        alias: "@", // если используете алиас @ для src
        ignoreImportPatterns: ["^@/shared", "^@/app"], // игнорируемые слои
      }],
      
      "fsd/layer-imports": ["error", {
        alias: "@",
        ignoreImportPatterns: [".css", ".scss", ".less"] // игнорируемые файлы
      }],
      
      "fsd/public-api": ["error", {
        alias: "@",
      }],
      
      "fsd/relative-path": ["error", {
        alias: "@",
      }],
    },
  },

  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;