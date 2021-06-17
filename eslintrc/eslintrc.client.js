module.exports = {
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        parserOptions: {
            project: 'tsconfig.json'
        },
        sourceType: 'module',
        ecmaVersion: 2020,
        ecmaFeatures: {
            jsx: true
        },
        extraFileExtensions: ['.vue']
    },
    extends: [
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended'
    ],
    rules: {
        quotes: ['error', 'single'],
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-unused-vars': 'off',
        'space-before-function-paren': 'off',
        'comma-dangle': ['error', 'never'],
        'vue/custom-event-name-casing': 'off',
        'no-use-before-define': 'off'
    }
}
