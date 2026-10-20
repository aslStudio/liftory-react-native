const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const prettier = require('eslint-plugin-prettier/recommended')
const simpleImportSort = require('eslint-plugin-simple-import-sort')

module.exports = defineConfig([
    {
        ignores: [
            'node_modules/**',
            '.expo/**',
            'dist/**',
            'web-build/**',
            'ios/**',
            'android/**',
            '.rnstorybook/storybook.requires.ts',
        ],
    },
    expoConfig,
    prettier,
    {
        plugins: { 'simple-import-sort': simpleImportSort },
        rules: {
            'import/order': 'off',
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        ['^node:'],
                        ['^@?\\w'],
                        ['^@/(?:app|application)(?:/|$)'],
                        ['^@/screens(?:/|$)'],
                        ['^@/widgets(?:/|$)'],
                        ['^@/features(?:/|$)'],
                        ['^@/entities(?:/|$)'],
                        ['^@/shared(?:/|$)'],
                        ['^@/'],
                        ['^\\u0000[^.]'],
                        ['^\\.', '^\\u0000\\.'],
                    ],
                },
            ],
        },
    },
])
