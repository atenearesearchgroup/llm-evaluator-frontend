// eslint.config.js
export default [// add more generic rule sets here, such as:
    // js.configs.recommended,
    ...eslintPluginAstro.configs['flat/recommended'],
    {
        rules: {
            // semi: "error",
            // "prefer-const": "error"
        }
    }
];