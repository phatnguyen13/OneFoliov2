import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["**/dist/**", "**/.next/**", "**/coverage/**", "**/node_modules/**"] },
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: { projectService: true, tsconfigRootDir: process.cwd() },
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/consistent-type-imports": "error",
            "no-console": ["warn", { allow: ["warn", "error"] }],
        },
    },
    {
        files: ["**/*.config.*", "**/*.mjs"],
        extends: [tseslint.configs.disableTypeChecked],
    },
);
