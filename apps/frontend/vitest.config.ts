import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: [
      'lib/**/*.spec.ts',
      'features/**/*.spec.ts',
      'features/**/*.spec.tsx',
      'components/**/*.spec.tsx',
    ],
    setupFiles: ['./test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
});
