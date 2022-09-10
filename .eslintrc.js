module.exports = {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
        ecmaFeatures: {
            jsx: true // Allows for the parsing of JSX
        }
    },
    settings: {
        react: {
            version: 'detect' // Tells eslint-plugin-react to automatically detect the version of React to use
        }
    },
    ignorePatterns: ['dist/*'],
    // plugins: ['react-hooks', 'no-relative-import-paths'],
    plugins: ['react-hooks'],
    extends: [
        'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'prettier', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        'plugin:prettier/recommended' // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        '@typescript-eslint/no-use-before-define': 'off',
        // 'no-relative-import-paths/no-relative-import-paths': [
        //     'warn',
        //     { allowSameFolder: true, rootDir: 'src' }
        // ],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        'jsx-a11y/accessible-emoji': 'off',
        'accessible-emoji': 'off',
        'react/no-array-index-key': 'warn',
        'react/react-in-jsx-scope': 'off',
        'react/self-closing-comp': [
            'error',
            {
                component: true,
                html: true
            }
        ]
    }
};
