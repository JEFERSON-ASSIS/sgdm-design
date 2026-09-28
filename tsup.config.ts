import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  target: 'es2020',
  // Os componentes usam estado e efeitos: no App Router do Next precisam ser
  // de cliente. O bundle é um arquivo só, então a diretiva vai no topo dele.
  banner: { js: "'use client';" },
  external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
});
