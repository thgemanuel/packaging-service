import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: { ...globals.node, ...globals.jest } } },
  {
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  eslintPluginPrettierRecommended,
];
