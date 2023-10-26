import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: ['es2016', 'chrome65'],
    lib: {
      entry: 'index.ts',
      fileName: 'index',
      name: '@busymango/utils',
    },
    rollupOptions: {
      output: {
        name: '@busymango/utils',
        globals: {
          '@busymango/is-esm': '@busymango/is-esm',
        },
      }
    }
  },
});
