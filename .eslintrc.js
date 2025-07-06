// basic eslint config, should probably add prettier integration
// also need to configure for TypeScript if we migrate later
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
    "no-unused-vars": "warn", // helps catch dead code
    "no-undef": "error", // catches typos in variable names
    "no-empty": "warn", // empty blocks are usually mistakes
    "no-prototype-builtins": "off", // this rule is annoying for my use cases
  },
};