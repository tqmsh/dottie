import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    testTimeout: 60000,
  },
}); 