import globals from "globals";
import hooks from "eslint-plugin-react-hooks";
export default [
  { ignores: ["dist/**", "node_modules/**", ".vite/**"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { "react-hooks": hooks },
    rules: { ...hooks.configs.recommended.rules },
  },
];
