module.exports = [
  {
    languageOptions: {
      globals: {
        process: "readonly",
      },
      parserOptions: {
        ecmaVersion: 2021,
      },
    },
    plugins: {
      node: {},
    },
    rules: {
      "no-console": "off", // Allow console.log and others for development
      "no-unused-vars": ["error", { args: "none" }], // Enforce unused variables detection
      "no-irregular-whitespace": "error", // Disallow irregular whitespace
      "prefer-const": "error", // Prefer const over let when variable is not reassigned
      indent: ["error", 2], // Enforce 2 spaces indentation
      semi: ["error", "always"], // Require semicolons at the end of statements
      quotes: ["error", "double"], // Enforce double quotes for strings
    },
  },
];
