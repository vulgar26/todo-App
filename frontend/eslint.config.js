// frontend/eslint.config.js
import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules', 'dist', 'build', 'coverage'] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } }, // ← 让 ESLint 解析 JSX
      globals: { ...globals.browser, ...globals.jest }, // ← fetch/URLSearchParams/describe/test
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // 目录还在调整，先关风格类规则，之后再逐步打开：
      'import/no-unresolved': 'off',
      'import/order': 'off'
    },
  },
];
