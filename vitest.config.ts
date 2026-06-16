import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/**', 'src/test-setup.ts', '.next/**'],
      thresholds: {
        lines: 70,
        functions: 60,
        branches: 70,
        statements: 70
      }
    },
  },
});
