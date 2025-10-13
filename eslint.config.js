const { defineConfig } = require('eslint-define-config')
const eslintPluginReact = require('eslint-plugin-react')
const eslintPluginPrettier = require('eslint-plugin-prettier')
const eslintPluginTypescript = require('@typescript-eslint/eslint-plugin')
const eslintParserTypescript = require('@typescript-eslint/parser')
const eslintPluginImport = require('eslint-plugin-import')

module.exports = defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        console: 'readonly',
        module: 'readonly',
        global: 'readonly',
        process: 'readonly'
      },
      parser: eslintParserTypescript,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    plugins: {
      react: eslintPluginReact,
      prettier: eslintPluginPrettier,
      '@typescript-eslint': eslintPluginTypescript,
      import: eslintPluginImport
    },
    rules: {
      'no-unused-vars': 'warn',
      'prefer-const': ['error', { ignoreReadBeforeAssign: true }],
      'import/prefer-default-export': 'off',
      'prettier/prettier': 'error'
    }
  },

  // TypeScript-specific
  {
    files: ['*.ts', '*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypescript
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },

  // React-specific
  {
    files: ['*.js', '*.jsx'],
    plugins: {
      react: eslintPluginReact
    },
    rules: {
      'react/prop-types': 'off',
      'prettier/prettier': 'error',
      'react/jsx-uses-react': 'off'
    }
  }
])
