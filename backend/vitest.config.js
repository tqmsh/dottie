import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    testTimeout: 60000,
    globalSetup: './test-utilities/setupDatabase.js',
    // Match anything with 'dev' in the file path or test name
    includeMatch: [
      // Include tests with 'dev' in the file path
      { name: 'dev', pattern: '**/dev/**' },
      { name: 'unit', pattern: '**/unit/**' },
      { name: 'e2e', pattern: '**/e2e/**' },
      { name: 'prod', pattern: '**/prod/**' }
    ]
  },
}); 