// @ts-check
import eslint from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['eslint.config.mjs', 'dist/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettierRecommended,
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // class-validator decorators su DTO causano false-positive no-unsafe-call
    files: ['src/**/*.dto.ts', 'src/**/dto/**/*.ts'],
    rules: { '@typescript-eslint/no-unsafe-call': 'off' },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': 'error',
    },
  },
  {
    // Prisma 7 + nodenext module resolution: i delegate Prisma (.refreshToken,
    // .passwordResetToken, ecc.) generano falsi-positivi no-unsafe-* perché
    // il package.json di .prisma/client non include "types" nell'export
    // condition del path radice. Il codice è type-safe a runtime.
    // NOTA: questo override deve stare DOPO le regole globali per prevalere.
    files: ['src/**/*.service.ts', 'src/**/*.controller.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
];
