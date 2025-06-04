module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": "warn", // Warn for unused variables
    "no-undef": "error", // Error for undefined variables
    "no-empty": "warn", // Warn for empty blocks
    "no-prototype-builtins": "off", // Disable prototype built-in rule
  },
};