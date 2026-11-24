import globals from "globals";
import base from "./base.mjs";

export default [
    ...base,
    {
        languageOptions: { globals: { ...globals.node } },
        rules: {
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
];
