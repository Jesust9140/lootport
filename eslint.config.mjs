// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";

export default [
  {
    ignores: [
      "**/build/**", 
      "**/docs/**", 
      "**/dist/**",
      "**/node_modules/**",
      "**/*.min.js",
      "**/*.bundle.js",
      "**/static/**",
      "client/build/**",
      "docs/**"
    ]
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        Intl: "readonly",
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": ["error", { 
        "varsIgnorePattern": "^React$",
        "argsIgnorePattern": "^_",
        "ignoreRestSiblings": true 
      }],
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
    },
  },
];
