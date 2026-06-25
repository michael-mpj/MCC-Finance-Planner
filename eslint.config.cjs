const reactPlugin = require("eslint-plugin-react");

module.exports = [
  {
    // Files the config applies to
    files: ["**/*.{js,jsx,ts,tsx}"],
    // Ignore build artifacts and backups
    ignores: ["node_modules/", "build/", "dist/", "backup/", "public/", "**/*.min.js", "**/*.bundle.js"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      react: reactPlugin
    },
    settings: {
      react: { version: "detect" }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
      "react/react-in-jsx-scope": "off"
    }
  }
];