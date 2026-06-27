import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Static SPA build -> dist/. Zero-config friendly for Vercel.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
