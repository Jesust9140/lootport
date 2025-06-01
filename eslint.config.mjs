import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";


export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ignores: ["client/build/**"], // Exclude build directory
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: "@babel/eslint-parser", 
      parserOptions: {
        requireConfigFile: false,
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
    },
  },
];
