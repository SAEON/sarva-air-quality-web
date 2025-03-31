import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Base URL for assets - if deploying to a subdirectory, change this
  base: './',
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
