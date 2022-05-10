import { resolve } from 'path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const pathSrc = resolve(__dirname, './src');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        cssHash: ({ css, hash }) => `x-${hash(css)}`,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': pathSrc,
    },
  },
});
