module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },
    extends: ['plugin:prettier/recommended'],
    plugins: ['react-hooks', 'react', '@typescript-eslint'],

    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. '@typescript-eslint/no-parameter-properties': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/indent': 'off', // this is handled by prettier
        //'@typescript-eslint/interface-name-prefix': 'warn', // TypeScript changed their mind and now recommend to not prefix interfaces
        '@typescript-eslint/no-empty-interface': ['warn', { allowSingleExtends: true }],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/display-name': 'off', //['error', { ignoreTranspilerName: true }]
        'no-restricted-imports': [
            'error',
            {
                patterns: ['@mui/*/*/*', '!@mui/material/test-utils/*'],
            },
        ],
        'no-console': ['error', { allow: ['error'] }], // console output slows down the app
    },
    settings: {
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
};
