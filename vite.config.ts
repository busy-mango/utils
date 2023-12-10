/// <reference types="vitest" />

import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        'index.ts',
        'src/css.ts',
        'src/dom.ts',
        'src/types.ts',
        'src/constants/**',
        'coverage/**',
        'dist/**',
        '**/[.]**',
        'packages/*/test?(s)/**',
        '**/*.d.ts',
        '**/virtual:*',
        '**/__x00__*',
        '**/\x00*',
        'cypress/**',
        'test?(s)/**',
        'test?(-*).?(c|m)[jt]s?(x)',
        '**/*{.,-}{test,spec}.?(c|m)[jt]s?(x)',
        '**/__tests__/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        '**/vitest.{workspace,projects}.[jt]s?(on)',
        '**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}',
      ]
    },
  },
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
