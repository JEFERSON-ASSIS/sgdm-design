import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';

const aqui = fileURLToPath(new URL('.', import.meta.url));

// Catálogo usa o código-fonte do pacote (../src), não o dist.
export default defineConfig({
  root: aqui,
  base: './',
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss({ config: fileURLToPath(new URL('./tailwind.config.cjs', import.meta.url)) }), autoprefixer()],
    },
  },
  build: { outDir: 'dist', emptyOutDir: true },
});
