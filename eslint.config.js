import js from '@eslint/js'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default [
  // ── Global ignores ─────────────────────────────────────────────
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/playwright-report/**',
      'server/prisma/migrations/**',
    ],
  },

  // ── Base JS rules (all files) ──────────────────────────────────
  js.configs.recommended,

  // ── React / Browser (apps/) ────────────────────────────────────
  {
    files: ['apps/**/*.{js,jsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    languageOptions: {
      globals: { ...globals.browser },
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off',  // React 17+ JSX transform
      'react/prop-types': 'off',           // Using JSDoc / Zod instead
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // ── Node.js (server/ and packages/) ───────────────────────────
  {
    files: ['server/**/*.js', 'packages/**/*.js', 'scripts/**/*.js'],
    languageOptions: {
      globals: { ...globals.node },
      ecmaVersion: 2024,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off', // Server uses Pino logger; console kept for startup errors
    },
  },
]

